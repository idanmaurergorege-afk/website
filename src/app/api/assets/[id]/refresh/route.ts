import { NextResponse } from "next/server";
import { refreshAsset } from "@/lib/refresh";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snapshot = await refreshAsset(id);
  if (!snapshot) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ snapshot });
}
