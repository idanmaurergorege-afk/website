import { NextResponse } from "next/server";
import { getMerchant } from "@/lib/nodalis/merchant";
import { createPaymentLink, listPaymentLinks } from "@/lib/nodalis/links";
import type { Coin } from "@/lib/nodalis/types";

export async function GET() {
  const merchant = getMerchant();
  if (!merchant) return NextResponse.json({ links: [] });
  return NextResponse.json({ links: listPaymentLinks(merchant.id) });
}

export async function POST(request: Request) {
  const merchant = getMerchant();
  if (!merchant) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await request.json();
  const title = (body.title as string)?.trim();
  const amount = Number(body.amount);
  const allowedCoins = body.allowedCoins as Coin[];

  if (!title || Number.isNaN(amount) || amount <= 0 || !Array.isArray(allowedCoins) || allowedCoins.length === 0) {
    return NextResponse.json(
      { error: "A title, positive amount, and at least one accepted coin are required." },
      { status: 400 },
    );
  }

  const link = createPaymentLink(merchant.id, {
    title,
    amount,
    currency: "USD",
    allowedCoins,
    kind: body.kind === "pos" ? "pos" : "link",
  });
  return NextResponse.json({ link }, { status: 201 });
}
