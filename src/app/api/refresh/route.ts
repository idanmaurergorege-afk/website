import { NextResponse } from "next/server";
import { listAssets } from "@/lib/assets";
import { refreshAllAssets } from "@/lib/refresh";

// Refreshes every asset's live/index price. Call this from a browser button,
// or wire it up to an external scheduler (Vercel Cron, a system cron job
// hitting this URL, etc.) for a daily auto-refresh — Next.js route handlers
// don't run background jobs on their own.
export async function POST() {
  const ids = listAssets().map((a) => a.id);
  const results = await refreshAllAssets(ids);
  return NextResponse.json({ results });
}
