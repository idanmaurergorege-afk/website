import { NextResponse } from "next/server";
import { deleteAsset, getAsset, updateAsset } from "@/lib/assets";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = getAsset(id);
  if (!asset) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ asset });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const asset = updateAsset(id, {
    category: body.category,
    name: body.name?.trim(),
    identifier: body.identifier,
    quantity: body.quantity != null ? Number(body.quantity) : undefined,
    purchasePrice: body.purchasePrice != null ? Number(body.purchasePrice) : undefined,
    purchaseDate: body.purchaseDate,
    manualCurrentValue: body.manualCurrentValue != null ? Number(body.manualCurrentValue) : null,
    manualValueDate: body.manualValueDate ?? null,
    location: body.location ?? null,
    notes: body.notes ?? null,
    newsKeyword: body.newsKeyword ?? null,
  });

  if (!asset) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ asset });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteAsset(id);
  return NextResponse.json({ ok: true });
}
