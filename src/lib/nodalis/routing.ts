import type { Coin, Merchant, Provider, Region, RoutingCandidate, RoutingDetail } from "./types";

function regionSupported(provider: Provider, region: Region): boolean {
  return provider.regions.includes("GLOBAL") || provider.regions.includes(region);
}

function coinSupported(provider: Provider, coin: Coin): boolean {
  return provider.coins.includes(coin);
}

const STATUS_RANK: Record<Provider["status"], number> = { healthy: 0, degraded: 1, down: 2 };

/**
 * Decides which licensed provider handles a payment, given the coin/region
 * requested and the merchant's routing preference. Mirrors the deck's
 * "intelligent multi-provider routing" rules: geography, coin support, cost,
 * and automatic failover away from degraded/down providers.
 */
export function routeTransaction(params: {
  coin: Coin;
  region: Region;
  merchant: Merchant;
  providers: Provider[];
}): RoutingDetail {
  const { coin, region, merchant, providers } = params;

  const candidates: RoutingCandidate[] = providers.map((p) => {
    const coinOk = coinSupported(p, coin);
    const regionOk = regionSupported(p, region);
    const eligible = coinOk && regionOk;
    let reason = "";
    if (!coinOk && !regionOk) reason = `Does not support ${coin} or serve ${region}`;
    else if (!coinOk) reason = `Does not support ${coin}`;
    else if (!regionOk) reason = `Not licensed to serve ${region}`;

    return {
      providerId: p.id,
      providerName: p.name,
      feeBps: p.feeBps,
      status: p.status,
      eligible,
      chosen: false,
      reason,
    };
  });

  const eligible = candidates.filter((c) => c.eligible && c.status !== "down");
  const usable = eligible.filter((c) => c.status === "healthy").length > 0
    ? eligible.filter((c) => c.status === "healthy")
    : eligible;

  let chosen: RoutingCandidate | null = null;

  if (merchant.routingStrategy === "preferred_provider" && merchant.preferredProviderId) {
    chosen = usable.find((c) => c.providerId === merchant.preferredProviderId) ?? null;
  }
  if (!chosen && usable.length > 0) {
    chosen = [...usable].sort((a, b) => a.feeBps - b.feeBps || STATUS_RANK[a.status] - STATUS_RANK[b.status])[0];
  }

  for (const c of candidates) {
    if (!c.eligible) continue;
    if (chosen && c.providerId === chosen.providerId) {
      c.chosen = true;
      const beatenDegraded = eligible.find(
        (e) => e.status !== "healthy" && e.feeBps < c.feeBps && e.providerId !== c.providerId,
      );
      c.reason =
        merchant.routingStrategy === "preferred_provider" && merchant.preferredProviderId === c.providerId
          ? "Selected — merchant's preferred provider"
          : beatenDegraded
            ? `Selected — lowest fee among healthy providers (${beatenDegraded.providerName} was cheaper but degraded)`
            : `Selected — lowest fee (${c.feeBps} bps) among eligible providers`;
    } else if (c.status === "down") {
      c.reason = "Eligible but currently down";
    } else if (c.status === "degraded") {
      c.reason = "Eligible but currently degraded — deprioritized for reliability";
    } else {
      c.reason = `Eligible, but higher fee (${c.feeBps} bps) than the selected provider`;
    }
  }

  const summary = chosen
    ? `Routed to ${chosen.providerName} for ${coin} payments from ${region}.`
    : `No licensed provider currently supports ${coin} for customers in ${region}.`;

  return {
    coin,
    region,
    candidates,
    chosenProviderId: chosen?.providerId ?? null,
    summary,
  };
}
