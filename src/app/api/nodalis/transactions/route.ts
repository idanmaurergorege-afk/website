import { NextResponse } from "next/server";
import { getMerchant } from "@/lib/nodalis/merchant";
import { listTransactions } from "@/lib/nodalis/transactions";

export async function GET(request: Request) {
  const merchant = getMerchant();
  if (!merchant) return NextResponse.json({ transactions: [] });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const paymentLinkId = searchParams.get("paymentLinkId") ?? undefined;

  return NextResponse.json({ transactions: listTransactions(merchant.id, { status, paymentLinkId }) });
}
