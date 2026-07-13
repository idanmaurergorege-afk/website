import { NextResponse } from "next/server";
import { getAsset } from "@/lib/assets";
import { getNewsProvider } from "@/lib/providers";

export async function GET(request: Request) {
  const assetId = new URL(request.url).searchParams.get("assetId");
  if (!assetId) return NextResponse.json({ error: "assetId is required" }, { status: 400 });

  const asset = getAsset(assetId);
  if (!asset) return NextResponse.json({ error: "not found" }, { status: 404 });

  const news = await getNewsProvider().getNews(asset);
  return NextResponse.json({ news });
}
