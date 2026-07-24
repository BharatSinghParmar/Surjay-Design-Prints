import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { getDesign, updateDesign, deleteDesign } from "@/lib/designs/store";
import { parseDesign } from "@/lib/designs/validate";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const design = await getDesign((await params).id);
  if (!design) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ design });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { error, value } = parseDesign(body, true);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const design = await updateDesign((await params).id, value);
  if (!design) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ design });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ok = await deleteDesign((await params).id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
