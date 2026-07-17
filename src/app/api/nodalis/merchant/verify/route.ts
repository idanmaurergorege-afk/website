import { NextResponse } from "next/server";
import { verifyMerchantKyb } from "@/lib/nodalis/merchant";

export async function POST() {
  const merchant = verifyMerchantKyb();
  if (!merchant) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ merchant });
}
