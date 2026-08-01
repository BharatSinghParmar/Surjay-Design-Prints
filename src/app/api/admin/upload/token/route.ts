import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getCurrentAdmin } from "@/lib/auth/session";
import { MAX_VIDEO_UPLOAD_BYTES } from "@/types/design";

export const runtime = "nodejs";

/**
 * Issues a short-lived Vercel Blob token so the browser can upload a video
 * straight to Blob.
 *
 * This exists because Vercel caps a serverless function's request body at
 * 4.5 MB at the infrastructure level — it cannot be raised from vercel.json or
 * from code — and every real testimonial clip is larger than that. Streaming one
 * through /api/admin/upload fails with FUNCTION_PAYLOAD_TOO_LARGE no matter what
 * MAX_UPLOAD_BYTES says. Here the file never touches the function; only the
 * token request does.
 *
 * Locally there is no Blob token, so the client falls back to the ordinary
 * upload route and development needs no configuration.
 */
/**
 * Whether this deployment can do client uploads at all.
 *
 * The client has to know before it starts: `upload()` replaces any error our
 * POST returns with its own generic "Failed to retrieve the client token", so
 * the reason cannot be recovered afterwards from the thrown error.
 */
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ clientUploadEnabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN) });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Blob storage is not configured." }, { status: 501 });
  }

  const body = (await req.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  try {
    const result = await handleUpload({
      body,
      request: req,
      // Re-checked on every token request, including the upload-completed
      // callback, so a leaked token cannot widen what may be uploaded.
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["video/mp4", "video/quicktime", "video/webm"],
        maximumSizeInBytes: MAX_VIDEO_UPLOAD_BYTES,
        addRandomSuffix: true
      })
      // No onUploadCompleted: that callback is delivered by Vercel's servers,
      // which carry no admin session and would be turned away by the 401 guard
      // above. Nothing needs recording anyway — the browser attaches the
      // returned URL to the testimonial through the authenticated admin API.
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 400 }
    );
  }
}
