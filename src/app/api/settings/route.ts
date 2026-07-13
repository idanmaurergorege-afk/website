import { NextResponse } from "next/server";
import { getKeyStatuses, setKeys, KEY_NAMES, type KeyName } from "@/lib/config";

export async function GET() {
  return NextResponse.json({ keys: getKeyStatuses() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const patch: Partial<Record<KeyName, string>> = {};

  for (const name of KEY_NAMES) {
    if (typeof body[name] === "string") patch[name] = body[name];
  }

  setKeys(patch);
  return NextResponse.json({ keys: getKeyStatuses() });
}
