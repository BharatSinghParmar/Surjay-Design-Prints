import "server-only";
import { neon } from "@neondatabase/serverless";
import type { AttributeDef, Design, DesignCategory, DesignFile } from "@/types/design";
import { DEFAULT_ATTRIBUTES } from "./seed";

/**
 * Postgres backend for the design catalogue (Neon over HTTP, so it works from
 * serverless functions with no connection pooling).
 *
 * Chosen over JSON-in-Blob because the catalogue is expected to grow: filtering
 * and ordering happen in SQL rather than by loading every record, and each save
 * touches one row instead of rewriting the whole document — so two admins
 * editing at the same time cannot overwrite each other.
 *
 * Uploaded files still live in Blob; only the records are stored here.
 */

// Vercel's Neon/Postgres integrations name the connection string differently
// depending on which one provisioned the database, so accept every variant
// rather than making setup depend on getting the name right.
const CONNECTION =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.NEON_DATABASE_URL ||
  "";

export const PG_ENABLED = Boolean(CONNECTION);

const sql = PG_ENABLED ? neon(CONNECTION) : null;

function db() {
  if (!sql) throw new Error("Postgres is not configured");
  return sql;
}

// ── Schema ─────────────────────────────────────────────────────────────────
let migrated: Promise<void> | null = null;

/** Create tables on first use. Idempotent, so there is no migration step. */
export function ensureSchema(): Promise<void> {
  if (!migrated) {
    migrated = (async () => {
      const q = db();
      await q`
        CREATE TABLE IF NOT EXISTS designs (
          id          TEXT PRIMARY KEY,
          title       TEXT NOT NULL,
          category    TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          files       JSONB NOT NULL DEFAULT '[]'::jsonb,
          attributes  JSONB NOT NULL DEFAULT '{}'::jsonb,
          status      TEXT NOT NULL DEFAULT 'available',
          featured    BOOLEAN NOT NULL DEFAULT false,
          sort_order  INTEGER NOT NULL DEFAULT 0,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      await q`CREATE INDEX IF NOT EXISTS designs_category_idx ON designs (category)`;
      await q`CREATE INDEX IF NOT EXISTS designs_status_idx ON designs (status)`;
      await q`
        CREATE INDEX IF NOT EXISTS designs_order_idx
        ON designs (featured DESC, sort_order ASC, created_at DESC)`;
      // Admin accounts live here, not in Blob: Blob objects are publicly
      // readable and password hashes must not be. Postgres is private.
      await q`
        CREATE TABLE IF NOT EXISTS admins (
          id            TEXT PRIMARY KEY,
          email         TEXT UNIQUE NOT NULL,
          name          TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      // Internal key/value settings — currently the session signing secret,
      // generated on first run so no environment variable is required.
      await q`
        CREATE TABLE IF NOT EXISTS app_settings (
          key   TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )`;
      await q`
        CREATE TABLE IF NOT EXISTS design_attributes (
          id           TEXT PRIMARY KEY,
          key          TEXT UNIQUE NOT NULL,
          label        TEXT NOT NULL,
          unit         TEXT,
          input_type   TEXT NOT NULL DEFAULT 'text',
          options      JSONB,
          visible      BOOLEAN NOT NULL DEFAULT true,
          show_on_card BOOLEAN NOT NULL DEFAULT false,
          sort_order   INTEGER NOT NULL DEFAULT 0
        )`;

      // Seed the starter feature set once, on an empty install.
      const [{ count }] = (await q`SELECT count(*)::int AS count FROM design_attributes`) as {
        count: number;
      }[];
      if (count === 0) {
        for (const a of DEFAULT_ATTRIBUTES) {
          await q`
            INSERT INTO design_attributes
              (id, key, label, unit, input_type, options, visible, show_on_card, sort_order)
            VALUES (${a.id}, ${a.key}, ${a.label}, ${a.unit ?? null}, ${a.inputType},
                    ${a.options ? JSON.stringify(a.options) : null}::jsonb,
                    ${a.visible}, ${a.showOnCard}, ${a.sortOrder})
            ON CONFLICT (key) DO NOTHING`;
        }
      }
    })().catch((err) => {
      migrated = null; // allow a retry on the next request
      throw err;
    });
  }
  return migrated;
}

// ── Row mapping ────────────────────────────────────────────────────────────
type DesignRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  files: DesignFile[];
  attributes: Record<string, string>;
  status: string;
  featured: boolean;
  sort_order: number;
  created_at: string | Date;
  updated_at: string | Date;
};

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toDesign(r: DesignRow): Design {
  return {
    id: r.id,
    title: r.title,
    category: r.category as DesignCategory,
    description: r.description,
    files: Array.isArray(r.files) ? r.files : [],
    attributes: r.attributes ?? {},
    status: r.status === "sold" ? "sold" : "available",
    featured: r.featured,
    sortOrder: r.sort_order,
    createdAt: toIso(r.created_at),
    updatedAt: toIso(r.updated_at)
  };
}

type AttributeRow = {
  id: string;
  key: string;
  label: string;
  unit: string | null;
  input_type: string;
  options: string[] | null;
  visible: boolean;
  show_on_card: boolean;
  sort_order: number;
};

function toAttribute(r: AttributeRow): AttributeDef {
  return {
    id: r.id,
    key: r.key,
    label: r.label,
    unit: r.unit ?? undefined,
    inputType: r.input_type as AttributeDef["inputType"],
    options: r.options ?? undefined,
    visible: r.visible,
    showOnCard: r.show_on_card,
    sortOrder: r.sort_order
  };
}

// ── Designs ────────────────────────────────────────────────────────────────
export async function pgListDesigns(opts: {
  category?: DesignCategory;
  includeSold?: boolean;
  limit?: number;
}): Promise<Design[]> {
  await ensureSchema();
  const q = db();
  const limit = opts.limit ?? 500;
  const rows = (await q`
    SELECT * FROM designs
    WHERE (${opts.category ?? null}::text IS NULL OR category = ${opts.category ?? null})
      AND (${opts.includeSold === false} = false OR status <> 'sold')
    ORDER BY featured DESC, sort_order ASC, created_at DESC
    LIMIT ${limit}`) as DesignRow[];
  return rows.map(toDesign);
}

export async function pgGetDesign(id: string): Promise<Design | null> {
  await ensureSchema();
  const rows = (await db()`SELECT * FROM designs WHERE id = ${id}`) as DesignRow[];
  return rows[0] ? toDesign(rows[0]) : null;
}

export async function pgCreateDesign(id: string, d: Omit<Design, "id" | "createdAt" | "updatedAt">): Promise<Design> {
  await ensureSchema();
  const rows = (await db()`
    INSERT INTO designs (id, title, category, description, files, attributes, status, featured, sort_order)
    VALUES (${id}, ${d.title}, ${d.category}, ${d.description ?? ""},
            ${JSON.stringify(d.files ?? [])}::jsonb, ${JSON.stringify(d.attributes ?? {})}::jsonb,
            ${d.status}, ${d.featured}, ${d.sortOrder})
    RETURNING *`) as DesignRow[];
  return toDesign(rows[0]);
}

export async function pgUpdateDesign(
  id: string,
  patch: Partial<Omit<Design, "id" | "createdAt" | "updatedAt">>
): Promise<Design | null> {
  await ensureSchema();
  // COALESCE keeps every column the caller did not send, so a partial update
  // never blanks out fields.
  const rows = (await db()`
    UPDATE designs SET
      title       = COALESCE(${patch.title ?? null}, title),
      category    = COALESCE(${patch.category ?? null}, category),
      description = COALESCE(${patch.description ?? null}, description),
      files       = COALESCE(${patch.files ? JSON.stringify(patch.files) : null}::jsonb, files),
      attributes  = COALESCE(${patch.attributes ? JSON.stringify(patch.attributes) : null}::jsonb, attributes),
      status      = COALESCE(${patch.status ?? null}, status),
      featured    = COALESCE(${patch.featured ?? null}, featured),
      sort_order  = COALESCE(${patch.sortOrder ?? null}, sort_order),
      updated_at  = now()
    WHERE id = ${id}
    RETURNING *`) as DesignRow[];
  return rows[0] ? toDesign(rows[0]) : null;
}

export async function pgDeleteDesign(id: string): Promise<boolean> {
  await ensureSchema();
  const rows = (await db()`DELETE FROM designs WHERE id = ${id} RETURNING id`) as { id: string }[];
  return rows.length > 0;
}

// ── Attributes ─────────────────────────────────────────────────────────────
export async function pgListAttributes(): Promise<AttributeDef[]> {
  await ensureSchema();
  const rows = (await db()`
    SELECT * FROM design_attributes ORDER BY sort_order ASC`) as AttributeRow[];
  return rows.map(toAttribute);
}

export async function pgUpsertAttribute(a: AttributeDef): Promise<AttributeDef> {
  await ensureSchema();
  await db()`
    INSERT INTO design_attributes
      (id, key, label, unit, input_type, options, visible, show_on_card, sort_order)
    VALUES (${a.id}, ${a.key}, ${a.label}, ${a.unit ?? null}, ${a.inputType},
            ${a.options ? JSON.stringify(a.options) : null}::jsonb,
            ${a.visible}, ${a.showOnCard}, ${a.sortOrder})
    ON CONFLICT (id) DO UPDATE SET
      label = EXCLUDED.label, unit = EXCLUDED.unit, input_type = EXCLUDED.input_type,
      options = EXCLUDED.options, visible = EXCLUDED.visible,
      show_on_card = EXCLUDED.show_on_card, sort_order = EXCLUDED.sort_order`;
  return a;
}

export async function pgDeleteAttribute(id: string): Promise<void> {
  await ensureSchema();
  await db()`DELETE FROM design_attributes WHERE id = ${id}`;
}

// ── Admin accounts ─────────────────────────────────────────────────────────
type AdminRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string | Date;
};

function toAdmin(r: AdminRow) {
  return {
    id: r.id,
    email: r.email,
    name: r.name,
    passwordHash: r.password_hash,
    createdAt: toIso(r.created_at)
  };
}

export async function pgListAdmins() {
  await ensureSchema();
  const rows = (await db()`
    SELECT * FROM admins ORDER BY created_at ASC`) as AdminRow[];
  return rows.map(toAdmin);
}

export async function pgCountAdmins(): Promise<number> {
  await ensureSchema();
  const [{ count }] = (await db()`SELECT count(*)::int AS count FROM admins`) as {
    count: number;
  }[];
  return count;
}

export async function pgCreateAdmin(admin: {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
}): Promise<boolean> {
  await ensureSchema();
  const rows = (await db()`
    INSERT INTO admins (id, email, name, password_hash)
    VALUES (${admin.id}, ${admin.email.toLowerCase()}, ${admin.name}, ${admin.passwordHash})
    ON CONFLICT (email) DO NOTHING
    RETURNING id`) as { id: string }[];
  return rows.length > 0;
}

export async function pgDeleteAdmin(id: string): Promise<boolean> {
  await ensureSchema();
  const rows = (await db()`DELETE FROM admins WHERE id = ${id} RETURNING id`) as { id: string }[];
  return rows.length > 0;
}

export async function pgUpdateAdminPassword(id: string, passwordHash: string): Promise<boolean> {
  await ensureSchema();
  const rows = (await db()`
    UPDATE admins SET password_hash = ${passwordHash} WHERE id = ${id} RETURNING id`) as {
    id: string;
  }[];
  return rows.length > 0;
}

// ── Settings ───────────────────────────────────────────────────────────────
export async function pgGetSetting(key: string): Promise<string | null> {
  await ensureSchema();
  const rows = (await db()`SELECT value FROM app_settings WHERE key = ${key}`) as {
    value: string;
  }[];
  return rows[0]?.value ?? null;
}

/** Insert only if absent, returning whichever value ends up stored. */
export async function pgSetSettingIfAbsent(key: string, value: string): Promise<string> {
  await ensureSchema();
  await db()`
    INSERT INTO app_settings (key, value) VALUES (${key}, ${value})
    ON CONFLICT (key) DO NOTHING`;
  return (await pgGetSetting(key)) ?? value;
}
