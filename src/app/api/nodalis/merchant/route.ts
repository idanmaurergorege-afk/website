import { NextResponse } from "next/server";
import { createMerchant, getMerchant, updateMerchant } from "@/lib/nodalis/merchant";

export async function GET() {
  return NextResponse.json({ merchant: getMerchant() ?? null });
}

export async function POST(request: Request) {
  const body = await request.json();
  const businessName = (body.businessName as string)?.trim();
  const businessType = body.businessType as string;
  const country = body.country as string;
  const contactEmail = (body.contactEmail as string)?.trim();

  if (!businessName || !businessType || !country || !contactEmail) {
    return NextResponse.json({ error: "All business profile fields are required." }, { status: 400 });
  }

  const merchant = createMerchant({ businessName, businessType, country, contactEmail });
  return NextResponse.json({ merchant }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const merchant = updateMerchant({
    settlementMode: body.settlementMode,
    settlementSplitPct: body.settlementSplitPct != null ? Number(body.settlementSplitPct) : undefined,
    preferredCoin: body.preferredCoin,
    integrationType: body.integrationType,
    routingStrategy: body.routingStrategy,
    preferredProviderId: body.preferredProviderId,
    onboardingStep: body.onboardingStep != null ? Number(body.onboardingStep) : undefined,
  });
  if (!merchant) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ merchant });
}
