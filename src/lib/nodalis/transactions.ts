import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { getPaymentLink } from "./links";
import { getProvider } from "./providers";
import type { NodalisEvent, NodalisEventType, Transaction, TransactionWithEvents } from "./types";

interface TransactionRow {
  id: string;
  merchantId: string;
  paymentLinkId: string | null;
  amount: number;
  currency: string;
  coin: string;
  customerRegion: string;
  providerId: string | null;
  feeBps: number | null;
  feeAmount: number | null;
  netAmount: number | null;
  settlementMode: string;
  settledFiatAmount: number | null;
  settledCryptoAmount: number | null;
  status: string;
  routingDetail: string;
  createdAt: string;
  settledAt: string | null;
  refundedAt: string | null;
}

function rowToTransaction(row: TransactionRow): Transaction {
  return {
    ...row,
    coin: row.coin as Transaction["coin"],
    customerRegion: row.customerRegion as Transaction["customerRegion"],
    settlementMode: row.settlementMode as Transaction["settlementMode"],
    status: row.status as Transaction["status"],
    routingDetail: JSON.parse(row.routingDetail),
  };
}

export function listTransactions(merchantId: string, opts?: { status?: string; paymentLinkId?: string }): Transaction[] {
  const clauses = ["merchantId = @merchantId"];
  const params: Record<string, string> = { merchantId };
  if (opts?.status) {
    clauses.push("status = @status");
    params.status = opts.status;
  }
  if (opts?.paymentLinkId) {
    clauses.push("paymentLinkId = @paymentLinkId");
    params.paymentLinkId = opts.paymentLinkId;
  }
  const rows = db
    .prepare(`SELECT * FROM nodalis_transaction WHERE ${clauses.join(" AND ")} ORDER BY createdAt DESC`)
    .all(params) as TransactionRow[];
  return rows.map(rowToTransaction);
}

export function getTransaction(id: string): Transaction | undefined {
  const row = db.prepare(`SELECT * FROM nodalis_transaction WHERE id = ?`).get(id) as TransactionRow | undefined;
  return row ? rowToTransaction(row) : undefined;
}

export function getTransactionWithEvents(id: string): TransactionWithEvents | undefined {
  const tx = getTransaction(id);
  if (!tx) return undefined;
  const events = listEvents(id);
  const link = tx.paymentLinkId ? getPaymentLink(tx.paymentLinkId) : undefined;
  const provider = tx.providerId ? getProvider(tx.providerId) : undefined;
  return { ...tx, events, paymentLinkTitle: link?.title ?? null, providerName: provider?.name ?? null };
}

export function listEvents(transactionId: string): NodalisEvent[] {
  return db
    .prepare(`SELECT * FROM nodalis_event WHERE transactionId = ? ORDER BY createdAt ASC`)
    .all(transactionId) as NodalisEvent[];
}

export function addEvent(transactionId: string, type: NodalisEventType, message: string): NodalisEvent {
  const event: NodalisEvent = { id: randomUUID(), transactionId, type, message, createdAt: new Date().toISOString() };
  db.prepare(
    `INSERT INTO nodalis_event (id, transactionId, type, message, createdAt) VALUES (@id, @transactionId, @type, @message, @createdAt)`,
  ).run(event);
  return event;
}

export function refundTransaction(id: string): Transaction | undefined {
  const tx = getTransaction(id);
  if (!tx || tx.status !== "settled") return tx;

  const now = new Date().toISOString();
  db.prepare(`UPDATE nodalis_transaction SET status = 'refunded', refundedAt = ? WHERE id = ?`).run(now, id);
  const providerName = tx.providerId ? (getProvider(tx.providerId)?.name ?? tx.providerId) : "provider";
  addEvent(id, "payment.refunded", `Refund processed for ${tx.amount} ${tx.currency} via ${providerName}.`);
  return getTransaction(id);
}
