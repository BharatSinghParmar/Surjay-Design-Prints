"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Plus, Trash2, UserPlus, X } from "lucide-react";

type AdminRow = { id: string; email: string; name: string; createdAt: string };

async function api(method: string, body: unknown) {
  const res = await fetch("/api/admin/admins", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Request failed");
  return data;
}

export function AdminsManager({
  currentId,
  initial
}: {
  currentId: string;
  initial: AdminRow[];
}) {
  const router = useRouter();
  const [admins, setAdmins] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [resetFor, setResetFor] = useState<AdminRow | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const field =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-magenta focus:outline-none";
  const label = "mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60";

  async function add() {
    setError("");
    setBusy(true);
    try {
      const { admin } = (await api("POST", form)) as { admin: AdminRow };
      setAdmins((list) => [...list, admin]);
      setForm({ name: "", email: "", password: "" });
      setAdding(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the admin.");
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    if (!resetFor) return;
    setError("");
    setBusy(true);
    try {
      await api("PATCH", { id: resetFor.id, password: newPassword });
      setResetFor(null);
      setNewPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change the password.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(admin: AdminRow) {
    if (!confirm(`Remove ${admin.name} (${admin.email}) from the admin team?`)) return;
    setError("");
    try {
      await api("DELETE", { id: admin.id });
      setAdmins((list) => list.filter((a) => a.id !== admin.id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove the admin.");
    }
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
              <h1 className="font-heading text-xl font-semibold text-navy">Admin Team</h1>
              <p className="text-xs text-charcoal/55">Who can manage the design catalogue</p>
            </div>
          </div>
          <button
            onClick={() => {
              setError("");
              setAdding(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-magenta px-3 py-2 text-sm font-semibold text-white hover:bg-wine"
          >
            <Plus className="h-4 w-4" /> Add Admin
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {error && (
          <p role="alert" className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {adding && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-premium">
            <div className="flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 font-heading text-lg font-semibold text-navy">
                <UserPlus className="h-4 w-4 text-magenta" /> New Admin
              </h2>
              <button onClick={() => setAdding(false)} className="text-charcoal/50 hover:text-charcoal">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={label}>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
              </div>
              <div>
                <label className={label}>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
              </div>
              <div>
                <label className={label}>Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={field} placeholder="Min 8 characters" />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={add} disabled={busy} className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink disabled:opacity-60">
                {busy ? "Adding…" : "Add Admin"}
              </button>
              <button onClick={() => setAdding(false)} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-charcoal/70 hover:bg-mist">
                Cancel
              </button>
            </div>
          </section>
        )}

        {resetFor && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-premium">
            <div className="flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 font-heading text-lg font-semibold text-navy">
                <KeyRound className="h-4 w-4 text-magenta" /> New password for {resetFor.name}
              </h2>
              <button onClick={() => setResetFor(null)} className="text-charcoal/50 hover:text-charcoal">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 max-w-sm">
              <label className={label}>Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={field} placeholder="Min 8 characters" />
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={resetPassword} disabled={busy} className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink disabled:opacity-60">
                {busy ? "Saving…" : "Save Password"}
              </button>
              <button onClick={() => setResetFor(null)} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-charcoal/70 hover:bg-mist">
                Cancel
              </button>
            </div>
          </section>
        )}

        <div className="space-y-2">
          {admins.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-base font-semibold text-navy">
                  {a.name}
                  {a.id === currentId && (
                    <span className="ml-2 rounded bg-mist px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-charcoal/60">
                      You
                    </span>
                  )}
                </h3>
                <p className="truncate text-xs text-charcoal/60">{a.email}</p>
              </div>
              <button
                onClick={() => {
                  setError("");
                  setNewPassword("");
                  setResetFor(a);
                }}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-mist"
              >
                Change password
              </button>
              <button
                onClick={() => remove(a)}
                disabled={a.id === currentId || admins.length <= 1}
                title={a.id === currentId ? "You cannot remove your own account" : "Remove admin"}
                className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
