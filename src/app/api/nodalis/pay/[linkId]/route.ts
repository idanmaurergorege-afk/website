import { NextResponse } from "next/server";
import { getPaymentLink } from "@/lib/nodalis/links";
import { getMerchant } from "@/lib/nodalis/merchant";
import { initiatePayment, PaymentError } from "@/lib/nodalis/payments";
import type { Coin, Region } from "@/lib/nodalis/types";

export async function GET(_request: Request, { params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = await params;
  const link = getPaymentLink(linkId);
  if (!link) return NextResponse.json({ error: "not found" }, { status: 404 });
  const merchant = getMerchant();
  return NextResponse.json({ link, businessName: merchant?.businessName ?? "Nodalis merchant" });
}

export async function POST(request: Request, { params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = await params;
  const body = await request.json();
  const coin = body.coin as Coin;
  const region = body.region as Region;

  if (!coin || !region) {
    return NextResponse.json({ error: "coin and region are required" }, { status: 400 });
  }

  try {
    const transaction = initiatePayment(linkId, coin, region);
    return NextResponse.json({ transaction }, { status: 201 });
  } catch (err) {
    if (err instanceof PaymentError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}
