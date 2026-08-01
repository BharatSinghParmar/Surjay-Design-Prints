"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FileText, LogOut, Plus, Quote, Settings2, Star, Trash2, Upload, Users, X } from "lucide-react";
import { adminApi } from "@/lib/admin/client";
import {
  DESIGN_CATEGORIES,
  acceptAttribute,
  acceptLabel,
  categoryLabel,
  type AdminPublic,
  type AttributeDef,
  type Design,
  type DesignCategory,
  type DesignFile,
  type DesignStatus
} from "@/types/design";

type FormState = {
  id?: string;
  title: string;
  category: DesignCategory;
  description: string;
  files: DesignFile[];
  attributes: Record<string, string>;
  status: DesignStatus;
  featured: boolean;
};

const EMPTY: FormState = {
  title: "",
  category: "printed",
  description: "",
  files: [],
  attributes: {},
  status: "available",
  featured: false
};

export function AdminDashboard({
  admin,
  initialDesigns,
  attributes
}: {
  admin: AdminPublic;
  initialDesigns: Design[];
  attributes: AttributeDef[];
}) {
  const router = useRouter();
  const [designs, setDesigns] = useState<Design[]>(initialDesigns);
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  function openNew() {
    setError("");
    setForm({ ...EMPTY, attributes: {} });
  }
  function openEdit(d: Design) {
    setError("");
    setForm({
      id: d.id,
      title: d.title,
      category: d.category,
      description: d.description ?? "",
      files: d.files,
      attributes: { ...d.attributes },
      status: d.status,
      featured: d.featured
    });
  }

  async function onUpload(files: FileList | null) {
    if (!files || !files.length || !form) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const { files: uploaded } = await adminApi.uploadFiles(fd);
      setForm((f) => (f ? { ...f, files: [...f.files, ...uploaded] } : f));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function save() {
    if (!form) return;
    if (!form.title.trim()) return setError("Title is required.");
    setBusy(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        files: form.files,
        attributes: form.attributes,
        status: form.status,
        featured: form.featured
      };
      if (form.id) {
        const { design } = await adminApi.updateDesign(form.id, payload);
        setDesigns((ds) => ds.map((d) => (d.id === design.id ? design : d)));
      } else {
        const { design } = await adminApi.createDesign(payload);
        setDesigns((ds) => [design, ...ds]);
      }
      setForm(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(d: Design) {
    if (!confirm(`Delete “${d.title}”? This cannot be undone.`)) return;
    await adminApi.deleteDesign(d.id);
    setDesigns((ds) => ds.filter((x) => x.id !== d.id));
    router.refresh();
  }

  async function toggleSold(d: Design) {
    const status: DesignStatus = d.status === "sold" ? "available" : "sold";
    const { design } = await adminApi.updateDesign(d.id, { status });
    setDesigns((ds) => ds.map((x) => (x.id === d.id ? design : x)));
    router.refresh();
  }

  async function logout() {
    await adminApi.logout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-mist">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="font-heading text-xl font-semibold text-navy">Design Catalogue</h1>
            <p className="text-xs text-charcoal/55">Signed in as {admin.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/admin/admins"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-navy hover:bg-mist"
            >
              <Users className="h-4 w-4" /> Team
            </a>
            <a
              href="/admin/attributes"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-navy hover:bg-mist"
            >
              <Settings2 className="h-4 w-4" /> Features
            </a>
            <a
              href="/admin/testimonials"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-navy hover:bg-mist"
            >
              <Quote className="h-4 w-4" /> Testimonials
            </a>
            <button
              onClick={openNew}
              className="inline-flex items-center gap-1.5 rounded-lg bg-magenta px-3 py-2 text-sm font-semibold text-white hover:bg-wine"
            >
              <Plus className="h-4 w-4" /> Add Design
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-charcoal/70 hover:bg-mist"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Form panel */}
        {form && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-premium">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-navy">
                {form.id ? "Edit Design" : "New Design"}
              </h2>
              <button onClick={() => setForm(null)} className="text-charcoal/50 hover:text-charcoal">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-magenta focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as DesignCategory })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-magenta focus:outline-none"
                >
                  {DESIGN_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-magenta focus:outline-none"
                />
              </div>
            </div>

            {/* Files */}
            <div className="mt-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-charcoal/60">
                Design Files ({acceptLabel(["image", "pdf"])})
              </label>
              <div className="flex flex-wrap gap-3">
                {form.files.map((f, i) => (
                  <div key={f.url} className="relative h-24 w-24 overflow-hidden rounded-lg border border-slate-200 bg-mist">
                    {f.type === "image" ? (
                      <Image src={f.url} alt={f.name} fill className="object-cover" sizes="96px" />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-1 text-charcoal/60">
                        <FileText className="h-6 w-6" />
                        <span className="px-1 text-[9px]">PDF</span>
                      </div>
                    )}
                    <button
                      onClick={() => setForm({ ...form, files: form.files.filter((_, j) => j !== i) })}
                      className="absolute right-1 top-1 rounded-full bg-navy/80 p-0.5 text-white hover:bg-navy"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInput.current?.click()}
                  disabled={busy}
                  className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-charcoal/50 hover:border-magenta hover:text-magenta"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-[10px] font-semibold">Upload</span>
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  accept={acceptAttribute(["image", "pdf"])}
                  className="hidden"
                  onChange={(e) => onUpload(e.target.files)}
                />
              </div>
            </div>

            {/* Dynamic attributes */}
            {attributes.length > 0 && (
              <div className="mt-5">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-charcoal/60">Features</label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {attributes.map((a) => (
                    <div key={a.id}>
                      <label className="mb-1 block text-xs text-charcoal/60">
                        {a.label}
                        {a.unit ? ` (${a.unit})` : ""}
                      </label>
                      {a.inputType === "select" ? (
                        <select
                          value={form.attributes[a.key] ?? ""}
                          onChange={(e) => setForm({ ...form, attributes: { ...form.attributes, [a.key]: e.target.value } })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        >
                          <option value="">—</option>
                          {(a.options ?? []).map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={a.inputType === "number" ? "number" : a.inputType === "color" ? "text" : "text"}
                          value={form.attributes[a.key] ?? ""}
                          onChange={(e) => setForm({ ...form, attributes: { ...form.attributes, [a.key]: e.target.value } })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status + featured */}
            <div className="mt-5 flex flex-wrap items-center gap-5">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.status === "sold"}
                  onChange={(e) => setForm({ ...form, status: e.target.checked ? "sold" : "available" })}
                />
                Mark as Sold
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Featured
              </label>
            </div>

            {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={save}
                disabled={busy}
                className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink disabled:opacity-60"
              >
                {busy ? "Saving…" : form.id ? "Save Changes" : "Publish Design"}
              </button>
              <button onClick={() => setForm(null)} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-charcoal/70 hover:bg-mist">
                Cancel
              </button>
            </div>
          </section>
        )}

        {/* Designs list */}
        {designs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-charcoal/60">No designs yet. Click <strong>Add Design</strong> to publish your first one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {designs.map((d) => (
              <div key={d.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="relative h-16 w-16 flex-none overflow-hidden rounded-lg bg-mist">
                  {d.files[0]?.type === "image" ? (
                    <Image src={d.files[0].url} alt={d.title} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-charcoal/40">
                      <FileText className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-heading text-base font-semibold text-navy">{d.title}</h3>
                    {d.featured && <Star className="h-3.5 w-3.5 flex-none fill-gold text-gold" />}
                    {d.status === "sold" && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700">Sold</span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal/55">
                    {categoryLabel(d.category)} · {d.files.length} file{d.files.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex flex-none items-center gap-2">
                  <button onClick={() => toggleSold(d)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-charcoal/70 hover:bg-mist">
                    {d.status === "sold" ? "Mark Available" : "Mark Sold"}
                  </button>
                  <button onClick={() => openEdit(d)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-mist">
                    Edit
                  </button>
                  <button onClick={() => remove(d)} className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
