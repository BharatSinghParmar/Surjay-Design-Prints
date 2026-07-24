"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Plus, Trash2, X } from "lucide-react";
import { adminApi } from "@/lib/admin/client";
import type { AttributeDef, AttributeInputType } from "@/types/design";

type FormState = {
  id?: string;
  label: string;
  unit: string;
  inputType: AttributeInputType;
  options: string;
  visible: boolean;
  showOnCard: boolean;
};

const EMPTY: FormState = { label: "", unit: "", inputType: "text", options: "", visible: true, showOnCard: false };

export function AttributesManager({ initial }: { initial: AttributeDef[] }) {
  const router = useRouter();
  const [attrs, setAttrs] = useState<AttributeDef[]>(initial);
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function openEdit(a: AttributeDef) {
    setError("");
    setForm({
      id: a.id,
      label: a.label,
      unit: a.unit ?? "",
      inputType: a.inputType,
      options: (a.options ?? []).join(", "),
      visible: a.visible,
      showOnCard: a.showOnCard
    });
  }

  async function save() {
    if (!form) return;
    if (!form.label.trim()) return setError("Label is required.");
    setBusy(true);
    setError("");
    const payload = {
      label: form.label.trim(),
      unit: form.unit.trim() || undefined,
      inputType: form.inputType,
      options:
        form.inputType === "select"
          ? form.options.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
      visible: form.visible,
      showOnCard: form.showOnCard
    };
    try {
      if (form.id) {
        const { attribute } = await adminApi.updateAttribute(form.id, payload);
        setAttrs((a) => a.map((x) => (x.id === attribute.id ? attribute : x)));
      } else {
        const { attribute } = await adminApi.createAttribute(payload);
        setAttrs((a) => [...a, attribute]);
      }
      setForm(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(a: AttributeDef, field: "visible" | "showOnCard") {
    const { attribute } = await adminApi.updateAttribute(a.id, { [field]: !a[field] });
    setAttrs((list) => list.map((x) => (x.id === a.id ? attribute : x)));
    router.refresh();
  }

  async function remove(a: AttributeDef) {
    if (!confirm(`Delete feature “${a.label}”? Values already saved on designs will be hidden.`)) return;
    await adminApi.deleteAttribute(a.id);
    setAttrs((list) => list.filter((x) => x.id !== a.id));
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-mist">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <a href="/admin" className="rounded-lg border border-slate-300 p-2 text-charcoal/70 hover:bg-mist">
              <ArrowLeft className="h-4 w-4" />
            </a>
            <div>
              <h1 className="font-heading text-xl font-semibold text-navy">Product Features</h1>
              <p className="text-xs text-charcoal/55">Define which specs exist and which show on the site</p>
            </div>
          </div>
          <button
            onClick={() => {
              setError("");
              setForm({ ...EMPTY });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-magenta px-3 py-2 text-sm font-semibold text-white hover:bg-wine"
          >
            <Plus className="h-4 w-4" /> Add Feature
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {form && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-premium">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-navy">{form.id ? "Edit Feature" : "New Feature"}</h2>
              <button onClick={() => setForm(null)} className="text-charcoal/50 hover:text-charcoal">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60">Label *</label>
                <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. Colour" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60">Unit</label>
                <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. m, in, GSM" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60">Input Type</label>
                <select value={form.inputType} onChange={(e) => setForm({ ...form, inputType: e.target.value as AttributeInputType })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Dropdown</option>
                  <option value="color">Colour</option>
                </select>
              </div>
              {form.inputType === "select" && (
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60">Options (comma-separated)</label>
                  <input value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Matte, Glossy, Soft" />
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-5">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} /> Show on website
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.showOnCard} onChange={(e) => setForm({ ...form, showOnCard: e.target.checked })} /> Show as chip on card
              </label>
            </div>
            {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <div className="mt-6 flex gap-3">
              <button onClick={save} disabled={busy} className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink disabled:opacity-60">
                {busy ? "Saving…" : "Save Feature"}
              </button>
              <button onClick={() => setForm(null)} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-charcoal/70 hover:bg-mist">Cancel</button>
            </div>
          </section>
        )}

        <div className="space-y-2">
          {attrs.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-base font-semibold text-navy">
                  {a.label}
                  {a.unit ? <span className="text-charcoal/45"> ({a.unit})</span> : null}
                </h3>
                <p className="text-xs text-charcoal/55">
                  {a.inputType}
                  {a.options?.length ? ` · ${a.options.join(", ")}` : ""}
                </p>
              </div>
              <button
                onClick={() => toggle(a, "visible")}
                title={a.visible ? "Visible on site" : "Hidden"}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${a.visible ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 text-charcoal/45"}`}
              >
                {a.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {a.visible ? "Shown" : "Hidden"}
              </button>
              <button
                onClick={() => toggle(a, "showOnCard")}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${a.showOnCard ? "border-gold/40 bg-gold/10 text-copper" : "border-slate-200 text-charcoal/45"}`}
              >
                Card chip
              </button>
              <button onClick={() => openEdit(a)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-mist">Edit</button>
              <button onClick={() => remove(a)} className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
