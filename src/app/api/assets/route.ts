import { NextResponse } from "next/server";
import { createAsset, getAssetsWithHistory } from "@/lib/assets";
import { refreshAsset } from "@/lib/refresh";
import type { Category } from "@/lib/types";

export async function GET() {
  return NextResponse.json({ assets: getAssetsWithHistory() });
}

export async function POST(request: Request) {
  const body = await request.json();

  const category = body.category as Category;
  const name = (body.name as string)?.trim();
  const purchasePrice = Number(body.purchasePrice);
  const purchaseDate = body.purchaseDate as string;

  if (!category || !name || !purchaseDate || Number.isNaN(purchasePrice)) {
    return NextResponse.json(
      { error: "category, name, purchaseDate and purchasePrice are required" },
      { status: 400 },
    );
  }

  const asset = createAsset({
    category,
    name,
    identifier: body.identifier ?? "",
    quantity: body.quantity != null ? Number(body.quantity) : 1,
    purchasePrice,
    purchaseDate,
    manualCurrentValue: body.manualCurrentValue != null ? Number(body.manualCurrentValue) : null,
    manualValueDate: body.manualValueDate ?? null,
    location: body.location ?? null,
    notes: body.notes ?? null,
    newsKeyword: body.newsKeyword ?? null,
  });

  // Seed an initial snapshot so the asset shows a value immediately.
  await refreshAsset(asset.id);

  return NextResponse.json({ asset }, { status: 201 });
}
