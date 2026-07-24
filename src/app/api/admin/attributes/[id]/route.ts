import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { listAttributes, upsertAttribute, deleteAttribute } from "@/lib/designs/store";
import type { AttributeDef, AttributeInputType } from "@/types/design";

export const runtime = "nodejs";

const INPUT_TYPES = new Set<AttributeInputType>(["text", "number", "select", "color"]);

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const current = (await listAttributes()).find((a) => a.id === id);
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  // key stays stable so existing design values keep mapping correctly
  const next: AttributeDef = {
    ...current,
    label: b.label !== undefined ? String(b.label).trim() || current.label : current.label,
    unit: b.unit !== undefined ? String(b.unit).trim() || undefined : current.unit,
    inputType: INPUT_TYPES.has(b.inputType as AttributeInputType)
      ? (b.inputType as AttributeInputType)
      : current.inputType,
    options:
      b.options !== undefined
        ? Array.isArray(b.options)
          ? b.options.map(String).filter(Boolean)
          : undefined
        : current.options,
    visible: b.visible !== undefined ? Boolean(b.visible) : current.visible,
    showOnCard: b.showOnCard !== undefined ? Boolean(b.showOnCard) : current.showOnCard,
    sortOrder: b.sortOrder !== undefined ? Number(b.sortOrder) || current.sortOrder : current.sortOrder
  };
  await upsertAttribute(next);
  return NextResponse.json({ attribute: next });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await deleteAttribute((await params).id);
  return NextResponse.json({ ok: true });
}
