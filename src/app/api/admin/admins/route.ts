import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { addAdmin, getAdmins, removeAdmin, changeAdminPassword } from "@/lib/auth/admins";
import { hashPassword } from "@/lib/auth/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Manage admin accounts from inside the panel. Signed-in admins only. */

export async function GET() {
  const current = await getCurrentAdmin();
  if (!current) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admins = await getAdmins();
  // Never expose password hashes to the client.
  return NextResponse.json({
    admins: admins.map((a) => ({ id: a.id, email: a.email, name: a.name, createdAt: a.createdAt })),
    currentId: current.id
  });
}

export async function POST(req: Request) {
  const current = await getCurrentAdmin();
  if (!current) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(body.email ?? "").trim();
  const name = String(body.name ?? "").trim();
  const password = String(body.password ?? "");

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!name) return NextResponse.json({ error: "Enter a name." }, { status: 400 });
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const admin = await addAdmin({ email, name, passwordHash: hashPassword(password) });
    return NextResponse.json(
      { admin: { id: admin.id, email: admin.email, name: admin.name, createdAt: admin.createdAt } },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not add the admin." },
      { status: 409 }
    );
  }
}

export async function PATCH(req: Request) {
  const current = await getCurrentAdmin();
  if (!current) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = String(body.id ?? "");
  const password = String(body.password ?? "");
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  const ok = await changeAdminPassword(id, hashPassword(password));
  if (!ok) return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const current = await getCurrentAdmin();
  if (!current) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = String(body.id ?? "");

  if (id === current.id) {
    return NextResponse.json(
      { error: "You cannot remove the account you are signed in with." },
      { status: 400 }
    );
  }
  const admins = await getAdmins();
  if (admins.length <= 1) {
    return NextResponse.json({ error: "At least one admin must remain." }, { status: 400 });
  }

  const ok = await removeAdmin(id);
  if (!ok) return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
