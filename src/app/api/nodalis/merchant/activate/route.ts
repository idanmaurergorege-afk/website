import { NextResponse } from "next/server";
import { activateMerchant } from "@/lib/nodalis/merchant";

export async function POST() {
  const merchant = activateMerchant();
  if (!merchant) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ merchant });
}
