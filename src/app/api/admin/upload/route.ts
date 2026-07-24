import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getCurrentAdmin } from "@/lib/auth/session";
import { ACCEPTED_UPLOAD_TYPES, MAX_UPLOAD_BYTES, type DesignFile } from "@/types/design";

export const runtime = "nodejs";

// Local dev driver: files land in public/uploads (git-ignored) and are served
// statically. In production this handler swaps to Vercel Blob `put()`.
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/tiff": "tif",
  "application/pdf": "pdf"
};

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const entries = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!entries.length) return NextResponse.json({ error: "No files provided." }, { status: 400 });

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const saved: DesignFile[] = [];
  for (const file of entries) {
    const type = ACCEPTED_UPLOAD_TYPES[file.type];
    if (!type) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type || "unknown"}. Allowed: JPG, PNG, WEBP, AVIF, TIFF, PDF.` },
        { status: 415 }
      );
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: `${file.name} exceeds the 25 MB per-file limit.` }, { status: 413 });
    }
    const ext = EXT[file.type] ?? "bin";
    const filename = `${Date.now().toString(36)}-${crypto.randomUUID()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);
    const url = `/uploads/${filename}`;
    saved.push({ url, type, name: file.name, thumbnailUrl: type === "image" ? url : undefined });
  }
  return NextResponse.json({ files: saved }, { status: 201 });
}
