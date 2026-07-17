import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { getPaymentLink } from "./links";
import { getMerchant } from "./merchant";
import { listProviders } from "./providers";
import { routeTransaction } from "./routing";
import { addEvent, getTransaction } from "./transactions";
import type { Coin, Region, Transaction } from "./types";

export class PaymentError extends Error {}

function computeSettlement(netAmount: number, mode: Transaction["settlementMode"], splitPct: number) {
  if (mode === "fiat") return { settledFiatAmount: netAmount, settledCryptoAmount: 0 };
  if (mode === "crypto") return { settledFiatAmount: 0, settledCryptoAmount: netAmount };
  const fiatShare = (netAmount * splitPct) / 100;
  return { settledFiatAmount: fiatShare, settledCryptoAmount: netAmount - fiatShare };
}

export function initiatePayment(linkId: string, coin: Coin, region: Region): Transaction {
  const link = getPaymentLink(linkId);
  if (!link || link.status !== "active") throw new PaymentError("This payment link is no longer available.");

  const merchant = getMerchant();
  if (!merchant || merchant.status !== "active") throw new PaymentError("This merchant is not accepting payments.");

  if (!link.allowedCoins.includes(coin)) throw new PaymentError(`This checkout does not accept ${coin}.`);

  const providers = listProviders();
  const routingDetail = routeTransaction({ coin, region, merchant, providers });

  const id = randomUUID();
  const now = new Date().toISOString();

  if (!routingDetail.chosenProviderId) {
    db.prepare(
      `INSERT INTO nodalis_transaction
        (id, merchantId, paymentLinkId, amount, currency, coin, customerRegion, providerId,
         feeBps, feeAmount, netAmount, settlementMode, settledFiatAmount, settledCryptoAmount,
         status, routingDetail, createdAt, settledAt, refundedAt)
       VALUES
        (@id, @merchantId, @paymentLinkId, @amount, @currency, @coin, @customerRegion, NULL,
         NULL, NULL, NULL, @settlementMode, NULL, NULL,
         'failed', @routingDetail, @createdAt, NULL, NULL)`,
    ).run({
      id,
      merchantId: merchant.id,
      paymentLinkId: link.id,
      amount: link.amount,
      currency: link.currency,
      coin,
      customerRegion: region,
      settlementMode: merchant.settlementMode,
      routingDetail: JSON.stringify(routingDetail),
      createdAt: now,
    });
    addEvent(id, "payment.created", `Customer requested to pay ${link.amount} ${link.currency} with ${coin} from ${region}.`);
    addEvent(id, "payment.failed", routingDetail.summary);
    return getTransaction(id)!;
  }

  const provider = providers.find((p) => p.id === routingDetail.chosenProviderId)!;
  const feeBps = provider.feeBps;
  const feeAmount = (link.amount * feeBps) / 10000;
  const netAmount = link.amount - feeAmount;
  const { settledFiatAmount, settledCryptoAmount } = computeSettlement(
    netAmount,
    merchant.settlementMode,
    merchant.settlementSplitPct,
  );

  db.prepare(
    `INSERT INTO nodalis_transaction
      (id, merchantId, paymentLinkId, amount, currency, coin, customerRegion, providerId,
       feeBps, feeAmount, netAmount, settlementMode, settledFiatAmount, settledCryptoAmount,
       status, routingDetail, createdAt, settledAt, refundedAt)
     VALUES
      (@id, @merchantId, @paymentLinkId, @amount, @currency, @coin, @customerRegion, @providerId,
       @feeBps, @feeAmount, @netAmount, @settlementMode, @settledFiatAmount, @settledCryptoAmount,
       'pending', @routingDetail, @createdAt, NULL, NULL)`,
  ).run({
    id,
    merchantId: merchant.id,
    paymentLinkId: link.id,
    amount: link.amount,
    currency: link.currency,
    coin,
    customerRegion: region,
    providerId: provider.id,
    feeBps,
    feeAmount,
    netAmount,
    settlementMode: merchant.settlementMode,
    settledFiatAmount,
    settledCryptoAmount,
    routingDetail: JSON.stringify(routingDetail),
    createdAt: now,
  });

  addEvent(id, "payment.created", `Customer requested to pay ${link.amount} ${link.currency} with ${coin} from ${region}.`);
  addEvent(id, "routing.decision", routingDetail.summary);

  const settlementDelayMs = 1200 + Math.random() * 1500;
  setTimeout(() => {
    try {
      settleTransaction(id);
    } catch {
      // best-effort background settlement; the transaction stays visible as pending if this throws
    }
  }, settlementDelayMs);

  return getTransaction(id)!;
}

export function settleTransaction(id: string): Transaction | undefined {
  const tx = getTransaction(id);
  if (!tx || tx.status !== "pending") return tx;

  const now = new Date().toISOString();
  db.prepare(`UPDATE nodalis_transaction SET status = 'settled', settledAt = ? WHERE id = ?`).run(now, id);
  addEvent(
    id,
    "payment.settled",
    `Settled via ${tx.routingDetail.candidates.find((c) => c.chosen)?.providerName ?? "provider"} — net ${tx.netAmount?.toFixed(2)} ${tx.currency} to merchant.`,
  );
  return getTransaction(id);
}
