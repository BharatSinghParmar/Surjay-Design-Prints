import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getCurrentAdmin } from "@/lib/auth/session";
import { BLOB_ENABLED, putBlobFile } from "@/lib/designs/blobStore";
import {
  UPLOAD_FORMATS,
  MAX_UPLOAD_BYTES,
  acceptLabel,
  type DesignFile,
  type DesignFileType
} from "@/types/design";

export const runtime = "nodejs";

// Two drivers: Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production), else
// public/uploads on the local filesystem (development).
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Video is accepted only in development.
 *
 * In production a clip streamed through this function would hit Vercel's
 * 4.5 MB request-body cap — an infrastructure limit no setting can raise — so
 * the browser uploads it straight to Blob via /api/admin/upload/token instead.
 * Locally there is no such cap and no Blob token, so this route takes it.
 */
const ALLOWED: DesignFileType[] = BLOB_ENABLED
  ? ["image", "pdf"]
  : ["image", "pdf", "video"];

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

  if (!BLOB_ENABLED) await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const saved: DesignFile[] = [];
  for (const file of entries) {
    const format = UPLOAD_FORMATS[file.type];
    if (!format || !ALLOWED.includes(format.type)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${file.type || "unknown"}. Allowed: ${acceptLabel(ALLOWED)}.`
        },
        { status: 415 }
      );
    }
    const type = format.type;
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: `${file.name} exceeds the 25 MB per-file limit.` }, { status: 413 });
    }
    const ext = format.ext;
    const filename = `${Date.now().toString(36)}-${crypto.randomUUID()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const url = BLOB_ENABLED
      ? await putBlobFile(filename, bytes, file.type)
      : (await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes), `/uploads/${filename}`);

    saved.push({ url, type, name: file.name, thumbnailUrl: type === "image" ? url : undefined });
  }
  return NextResponse.json({ files: saved }, { status: 201 });
}
