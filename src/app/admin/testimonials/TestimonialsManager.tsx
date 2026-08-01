"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Film, Plus, Star, Trash2, Upload, X } from "lucide-react";
import { adminApi } from "@/lib/admin/client";
import { acceptAttribute } from "@/types/design";
import type { Testimonial } from "@/types/testimonial";

type FormState = {
  id?: string;
  quote: string;
  authorName: string;
  authorRole: string;
  company: string;
  location: string;
  outcome: string;
  photoUrl: string;
  logoUrl: string;
  videoUrl: string;
  videoPosterUrl: string;
  consentGiven: boolean;
  consentNote: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

const EMPTY: FormState = {
  quote: "",
  authorName: "",
  authorRole: "",
  company: "",
  location: "",
  outcome: "",
  photoUrl: "",
  logoUrl: "",
  videoUrl: "",
  videoPosterUrl: "",
  consentGiven: false,
  consentNote: "",
  featured: false,
  published: false,
  sortOrder: 0
};

function toForm(t: Testimonial): FormState {
  return {
    id: t.id,
    quote: t.quote,
    authorName: t.authorName,
    authorRole: t.authorRole ?? "",
    company: t.company ?? "",
    location: t.location ?? "",
    outcome: t.outcome ?? "",
    photoUrl: t.photoUrl ?? "",
    logoUrl: t.logoUrl ?? "",
    videoUrl: t.videoUrl ?? "",
    videoPosterUrl: t.videoPosterUrl ?? "",
    consentGiven: t.consentGiven,
    consentNote: t.consentNote ?? "",
    featured: t.featured,
    published: t.published,
    sortOrder: t.sortOrder
  };
}

/**
 * Empty strings are sent as null so clearing a field in the UI actually clears
 * the stored value — the API treats "absent" and "null" differently.
 */
function toPayload(f: FormState): Partial<Testimonial> {
  const clear = (v: string) => (v.trim() === "" ? null : v.trim());
  return {
    quote: f.quote.trim(),
    authorName: f.authorName.trim(),
    authorRole: clear(f.authorRole),
    company: clear(f.company),
    location: clear(f.location),
    outcome: clear(f.outcome),
    photoUrl: clear(f.photoUrl),
    logoUrl: clear(f.logoUrl),
    videoUrl: clear(f.videoUrl),
    videoPosterUrl: clear(f.videoPosterUrl),
    consentGiven: f.consentGiven,
    consentNote: clear(f.consentNote),
    featured: f.featured,
    published: f.published,
    sortOrder: f.sortOrder
  } as Partial<Testimonial>;
}

export function TestimonialsManager({ initial }: { initial: Testimonial[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState<FormState | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<"photo" | "logo" | "video" | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const logoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  const field =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-magenta focus:outline-none";
  const label = "mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60";

  async function uploadImage(files: FileList | null, key: "photoUrl" | "logoUrl") {
    if (!files?.length || !form) return;
    setError("");
    setUploading(key === "photoUrl" ? "photo" : "logo");
    try {
      const fd = new FormData();
      fd.append("files", files[0]);
      const { files: saved } = await adminApi.uploadFiles(fd);
      setForm((f) => (f ? { ...f, [key]: saved[0].url } : f));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(null);
    }
  }

  async function uploadVideo(files: FileList | null) {
    if (!files?.length || !form) return;
    setError("");
    setUploading("video");
    try {
      const url = await adminApi.uploadVideo(files[0]);
      setForm((f) => (f ? { ...f, videoUrl: url } : f));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    if (!form) return;
    setError("");
    setBusy(true);
    try {
      const payload = toPayload(form);
      if (form.id) {
        const { testimonial } = await adminApi.updateTestimonial(form.id, payload);
        setItems((list) => list.map((t) => (t.id === testimonial.id ? testimonial : t)));
      } else {
        const { testimonial } = await adminApi.createTestimonial(payload);
        setItems((list) => [...list, testimonial]);
      }
      setForm(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the testimonial.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(t: Testimonial) {
    if (!confirm(`Delete the testimonial from ${t.authorName}?`)) return;
    setError("");
    try {
      await adminApi.deleteTestimonial(t.id);
      setItems((list) => list.filter((x) => x.id !== t.id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the testimonial.");
    }
  }

  return (
    <div className="min-h-screen bg-mist">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <a href="/admin" className="rounded-lg border border-slate-300 p-2 text-charcoal/70 hover:bg-mist">
              <ArrowLeft className="h-4 w-4" />
            </a>
            <div>
              <h1 className="font-heading text-xl font-semibold text-navy">Testimonials</h1>
              <p className="text-xs text-charcoal/55">What buyers say, shown on the home page</p>
            </div>
          </div>
          <button
            onClick={() => {
              setError("");
              setForm({ ...EMPTY });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-magenta px-3 py-2 text-sm font-semibold text-white hover:bg-wine"
          >
            <Plus className="h-4 w-4" /> Add Testimonial
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {error && (
          <p role="alert" className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {form && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-premium">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-navy">
                {form.id ? "Edit Testimonial" : "New Testimonial"}
              </h2>
              <button onClick={() => setForm(null)} className="text-charcoal/50 hover:text-charcoal">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5">
              <label className={label}>Quote *</label>
              <textarea
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                rows={3}
                className={field}
                placeholder="What the buyer said, in their words."
              />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className={label}>Name *</label>
                <input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} className={field} />
              </div>
              <div>
                <label className={label}>Role</label>
                <input value={form.authorRole} onChange={(e) => setForm({ ...form, authorRole: e.target.value })} className={field} placeholder="Purchase Head" />
              </div>
              <div>
                <label className={label}>Company</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={field} />
              </div>
              <div>
                <label className={label}>Location</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={field} placeholder="Jaipur" />
              </div>
            </div>

            <div className="mt-5">
              <label className={label}>Result</label>
              <input
                value={form.outcome}
                onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                className={field}
                placeholder="40,000 m a month with no shade rejections"
              />
              <p className="mt-1 text-xs text-charcoal/50">
                A specific, checkable number carries far more weight with buyers than general praise.
              </p>
            </div>

            {/* Media */}
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <MediaSlot
                title="Headshot"
                url={form.photoUrl}
                busy={uploading === "photo"}
                onPick={() => photoInput.current?.click()}
                onClear={() => setForm({ ...form, photoUrl: "" })}
              />
              <MediaSlot
                title="Company logo"
                url={form.logoUrl}
                busy={uploading === "logo"}
                onPick={() => logoInput.current?.click()}
                onClear={() => setForm({ ...form, logoUrl: "" })}
              />
              <div>
                <p className={label}>Video</p>
                <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-mist">
                  {form.videoUrl ? (
                    <>
                      <video src={form.videoUrl} muted playsInline className="h-full w-full object-cover" />
                      <button
                        onClick={() => setForm({ ...form, videoUrl: "" })}
                        aria-label="Remove video"
                        className="absolute right-1 top-1 rounded-full bg-navy/80 p-1 text-white hover:bg-navy"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => videoInput.current?.click()}
                      disabled={uploading === "video"}
                      className="flex flex-col items-center gap-1 text-charcoal/50 hover:text-magenta disabled:opacity-60"
                    >
                      <Film className="h-5 w-5" />
                      <span className="text-[10px] font-semibold">
                        {uploading === "video" ? "Uploading…" : "Upload clip"}
                      </span>
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-charcoal/50">
                  Phone footage is fine — buyers trust it more than a polished edit.
                </p>
              </div>
            </div>

            <input ref={photoInput} type="file" accept={acceptAttribute(["image"])} className="hidden" onChange={(e) => uploadImage(e.target.files, "photoUrl")} />
            <input ref={logoInput} type="file" accept={acceptAttribute(["image"])} className="hidden" onChange={(e) => uploadImage(e.target.files, "logoUrl")} />
            <input ref={videoInput} type="file" accept={acceptAttribute(["video"])} className="hidden" onChange={(e) => uploadVideo(e.target.files)} />

            {/* Consent + placement */}
            <div className="mt-6 rounded-lg border border-slate-200 bg-mist/60 p-4">
              <label className="flex items-start gap-3 text-sm text-charcoal/80">
                <input
                  type="checkbox"
                  checked={form.consentGiven}
                  onChange={(e) => setForm({ ...form, consentGiven: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-magenta focus:ring-magenta"
                />
                <span>
                  <strong className="font-semibold text-navy">This buyer agreed to be quoted publicly.</strong>
                  <span className="block text-xs text-charcoal/60">
                    Required before it can be published — their name, face and words go on a public page.
                  </span>
                </span>
              </label>
              <div className="mt-3">
                <label className={label}>How consent was given</label>
                <input
                  value={form.consentNote}
                  onChange={(e) => setForm({ ...form, consentNote: e.target.value })}
                  className={field}
                  placeholder="WhatsApp, 12 March 2026"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-charcoal/80">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-magenta focus:ring-magenta"
                />
                Show on the website
              </label>
              <label className="flex items-center gap-2 text-sm text-charcoal/80">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-magenta focus:ring-magenta"
                />
                Feature first
              </label>
              <label className="flex items-center gap-2 text-sm text-charcoal/80">
                Order
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
                  className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-magenta focus:outline-none"
                />
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={save}
                disabled={busy || uploading !== null}
                className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save Testimonial"}
              </button>
              <button
                onClick={() => setForm(null)}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-charcoal/70 hover:bg-mist"
              >
                Cancel
              </button>
            </div>
          </section>
        )}

        {items.length === 0 && !form && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-charcoal/60">
            No testimonials yet. Add one and it appears on the home page as soon as you tick
            &ldquo;Show on the website&rdquo;.
          </p>
        )}

        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="flex flex-wrap items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="relative h-12 w-12 flex-none overflow-hidden rounded-full bg-navy">
                {t.photoUrl ? (
                  <Image src={t.photoUrl} alt="" fill sizes="48px" className="object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-sm font-bold text-white">
                    {t.authorName.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="flex flex-wrap items-center gap-2 font-heading text-base font-semibold text-navy">
                  {t.authorName}
                  {t.featured && <Star className="h-3.5 w-3.5 fill-gold text-gold" />}
                  {t.videoUrl && (
                    <span className="inline-flex items-center gap-1 rounded bg-mist px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-charcoal/60">
                      <Film className="h-3 w-3" /> Video
                    </span>
                  )}
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      t.published && t.consentGiven
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {t.published && t.consentGiven ? "Live" : t.published ? "Needs consent" : "Hidden"}
                  </span>
                </h3>
                <p className="text-xs text-charcoal/60">
                  {[t.authorRole, t.company, t.location].filter(Boolean).join(" · ") || "—"}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-charcoal/72">{t.quote}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setError("");
                    setForm(toForm(t));
                  }}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-mist"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(t)}
                  aria-label={`Delete testimonial from ${t.authorName}`}
                  className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function MediaSlot({
  title,
  url,
  busy,
  onPick,
  onClear
}: {
  title: string;
  url: string;
  busy: boolean;
  onPick: () => void;
  onClear: () => void;
}) {
  return (
    <div>
      <p className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60">{title}</p>
      <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-mist">
        {url ? (
          <>
            <Image src={url} alt="" fill sizes="160px" className="object-cover" />
            <button
              onClick={onClear}
              aria-label={`Remove ${title.toLowerCase()}`}
              className="absolute right-1 top-1 rounded-full bg-navy/80 p-1 text-white hover:bg-navy"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : (
          <button
            onClick={onPick}
            disabled={busy}
            className="flex flex-col items-center gap-1 text-charcoal/50 hover:text-magenta disabled:opacity-60"
          >
            <Upload className="h-5 w-5" />
            <span className="text-[10px] font-semibold">{busy ? "Uploading…" : "Upload"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
