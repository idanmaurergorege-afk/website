import { NextResponse } from "next/server";
import { listProviders } from "@/lib/nodalis/providers";

export async function GET() {
  return NextResponse.json({ providers: listProviders() });
}
