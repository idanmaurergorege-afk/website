import { NextResponse } from "next/server";
import { getMerchant } from "@/lib/nodalis/merchant";
import { getDashboardSummary } from "@/lib/nodalis/summary";

export async function GET() {
  const merchant = getMerchant();
  if (!merchant) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ summary: getDashboardSummary(merchant.id) });
}
