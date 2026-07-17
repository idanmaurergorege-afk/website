import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import type { Merchant } from "./types";
import { createPaymentLink } from "./links";

export function getMerchant(): Merchant | undefined {
  return db.prepare(`SELECT * FROM nodalis_merchant ORDER BY createdAt ASC LIMIT 1`).get() as Merchant | undefined;
}

export interface CreateMerchantInput {
  businessName: string;
  businessType: string;
  country: string;
  contactEmail: string;
}

export function createMerchant(input: CreateMerchantInput): Merchant {
  const existing = getMerchant();
  if (existing) return existing;

  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO nodalis_merchant
      (id, businessName, businessType, country, contactEmail, kybStatus, settlementMode,
       settlementSplitPct, preferredCoin, integrationType, routingStrategy, preferredProviderId,
       status, onboardingStep, createdAt, updatedAt)
     VALUES
      (@id, @businessName, @businessType, @country, @contactEmail, 'pending', 'fiat',
       50, 'USDC', 'hosted_checkout', 'lowest_cost', NULL,
       'onboarding', 2, @createdAt, @updatedAt)`,
  ).run({ id, ...input, createdAt: now, updatedAt: now });

  return getMerchant()!;
}

export function verifyMerchantKyb(): Merchant | undefined {
  const merchant = getMerchant();
  if (!merchant) return undefined;
  db.prepare(
    `UPDATE nodalis_merchant SET kybStatus = 'verified', onboardingStep = 3, updatedAt = @updatedAt WHERE id = @id`,
  ).run({ id: merchant.id, updatedAt: new Date().toISOString() });
  return getMerchant();
}

export interface UpdateMerchantInput {
  settlementMode?: Merchant["settlementMode"];
  settlementSplitPct?: number;
  preferredCoin?: Merchant["preferredCoin"];
  integrationType?: Merchant["integrationType"];
  routingStrategy?: Merchant["routingStrategy"];
  preferredProviderId?: string | null;
  onboardingStep?: number;
}

export function updateMerchant(patch: UpdateMerchantInput): Merchant | undefined {
  const existing = getMerchant();
  if (!existing) return undefined;

  const definedPatch = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
  const merged = { ...existing, ...definedPatch, updatedAt: new Date().toISOString() };
  db.prepare(
    `UPDATE nodalis_merchant SET
      settlementMode = @settlementMode,
      settlementSplitPct = @settlementSplitPct,
      preferredCoin = @preferredCoin,
      integrationType = @integrationType,
      routingStrategy = @routingStrategy,
      preferredProviderId = @preferredProviderId,
      onboardingStep = @onboardingStep,
      updatedAt = @updatedAt
     WHERE id = @id`,
  ).run(merged);
  return getMerchant();
}

export function activateMerchant(): Merchant | undefined {
  const merchant = getMerchant();
  if (!merchant) return undefined;

  db.prepare(
    `UPDATE nodalis_merchant SET status = 'active', onboardingStep = 5, updatedAt = @updatedAt WHERE id = @id`,
  ).run({ id: merchant.id, updatedAt: new Date().toISOString() });

  // Seed a starter payment link so the dashboard isn't empty on first login.
  createPaymentLink(merchant.id, {
    title: "Demo Storefront Checkout",
    amount: 50,
    currency: "USD",
    allowedCoins: ["USDC", "USDT", "EURC", "BTC", "ETH"],
  });

  return getMerchant();
}

export function resetMerchant(): void {
  db.prepare(`DELETE FROM nodalis_event`).run();
  db.prepare(`DELETE FROM nodalis_transaction`).run();
  db.prepare(`DELETE FROM nodalis_payment_link`).run();
  db.prepare(`DELETE FROM nodalis_merchant`).run();
}
