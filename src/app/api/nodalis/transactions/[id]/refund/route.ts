import { NextResponse } from "next/server";
import { getTransaction, refundTransaction } from "@/lib/nodalis/transactions";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = getTransaction(id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (existing.status !== "settled") {
    return NextResponse.json({ error: "Only settled transactions can be refunded." }, { status: 400 });
  }
  const transaction = refundTransaction(id);
  return NextResponse.json({ transaction });
}
