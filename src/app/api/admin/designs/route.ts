import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { listDesigns, createDesign } from "@/lib/designs/store";
import { parseDesign, type DesignFields } from "@/lib/designs/validate";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ designs: await listDesigns() });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { error, value } = parseDesign(body, false);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const design = await createDesign(value as DesignFields);
  return NextResponse.json({ design }, { status: 201 });
}
