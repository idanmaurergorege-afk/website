import { NextResponse } from "next/server";
import { getTransactionWithEvents } from "@/lib/nodalis/transactions";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = getTransactionWithEvents(id);
  if (!transaction) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ transaction });
}
