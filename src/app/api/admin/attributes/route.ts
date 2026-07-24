import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { listAttributes, upsertAttribute, newId } from "@/lib/designs/store";
import type { AttributeDef, AttributeInputType } from "@/types/design";

export const runtime = "nodejs";

const INPUT_TYPES = new Set<AttributeInputType>(["text", "number", "select", "color"]);

function slugKey(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "") || "attr"
  );
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ attributes: await listAttributes() });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const label = String(b.label ?? "").trim();
  if (!label) return NextResponse.json({ error: "Label is required." }, { status: 400 });

  const existing = await listAttributes();
  const key = slugKey(typeof b.key === "string" && b.key ? b.key : label);
  if (existing.some((a) => a.key === key)) {
    return NextResponse.json({ error: `A feature with key "${key}" already exists.` }, { status: 409 });
  }

  const inputType = INPUT_TYPES.has(b.inputType as AttributeInputType)
    ? (b.inputType as AttributeInputType)
    : "text";

  const attr: AttributeDef = {
    id: newId(),
    key,
    label,
    unit: b.unit ? String(b.unit).trim() : undefined,
    inputType,
    options: Array.isArray(b.options) ? b.options.map(String).filter(Boolean) : undefined,
    visible: b.visible !== false,
    showOnCard: Boolean(b.showOnCard),
    sortOrder: Number(b.sortOrder) || existing.length + 1
  };
  await upsertAttribute(attr);
  return NextResponse.json({ attribute: attr }, { status: 201 });
}
