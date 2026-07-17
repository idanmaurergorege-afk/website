import { NextResponse } from "next/server";
import { getPaymentLink, setPaymentLinkStatus } from "@/lib/nodalis/links";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const link = getPaymentLink(id);
  if (!link) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ link });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const status = body.status === "archived" ? "archived" : "active";
  const link = setPaymentLinkStatus(id, status);
  if (!link) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ link });
}
