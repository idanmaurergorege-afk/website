import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import type { Coin, LinkKind, PaymentLink } from "./types";

interface PaymentLinkRow {
  id: string;
  merchantId: string;
  title: string;
  amount: number;
  currency: string;
  allowedCoins: string;
  kind: string;
  status: string;
  createdAt: string;
}

function rowToLink(row: PaymentLinkRow): PaymentLink {
  return {
    id: row.id,
    merchantId: row.merchantId,
    title: row.title,
    amount: row.amount,
    currency: row.currency,
    allowedCoins: JSON.parse(row.allowedCoins),
    kind: row.kind as LinkKind,
    status: row.status as PaymentLink["status"],
    createdAt: row.createdAt,
  };
}

export function listPaymentLinks(merchantId: string): PaymentLink[] {
  const rows = db
    .prepare(`SELECT * FROM nodalis_payment_link WHERE merchantId = ? ORDER BY createdAt DESC`)
    .all(merchantId) as PaymentLinkRow[];
  return rows.map(rowToLink);
}

export function getPaymentLink(id: string): PaymentLink | undefined {
  const row = db.prepare(`SELECT * FROM nodalis_payment_link WHERE id = ?`).get(id) as PaymentLinkRow | undefined;
  return row ? rowToLink(row) : undefined;
}

export interface CreatePaymentLinkInput {
  title: string;
  amount: number;
  currency: string;
  allowedCoins: Coin[];
  kind?: LinkKind;
}

export function createPaymentLink(merchantId: string, input: CreatePaymentLinkInput): PaymentLink {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO nodalis_payment_link (id, merchantId, title, amount, currency, allowedCoins, kind, status, createdAt)
     VALUES (@id, @merchantId, @title, @amount, @currency, @allowedCoins, @kind, 'active', @createdAt)`,
  ).run({
    id,
    merchantId,
    title: input.title,
    amount: input.amount,
    currency: input.currency,
    allowedCoins: JSON.stringify(input.allowedCoins),
    kind: input.kind ?? "link",
    createdAt: new Date().toISOString(),
  });
  return getPaymentLink(id)!;
}

export function setPaymentLinkStatus(id: string, status: PaymentLink["status"]): PaymentLink | undefined {
  db.prepare(`UPDATE nodalis_payment_link SET status = ? WHERE id = ?`).run(status, id);
  return getPaymentLink(id);
}
