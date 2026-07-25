# Admin Panel — Setup

Switching on the Design Catalogue at **/admin**. Two clicks in Vercel, then one
form in the browser. **No terminal commands, no environment variables.**

Both storage services below are on free tiers.

| Service | Holds | Free tier |
|---|---|---|
| **Vercel Blob** | uploaded design images and PDFs | 1 GB |
| **Neon Postgres** | design records and admin accounts | 0.5 GB |

Why both: images do not belong in a database, and records do not belong in one
JSON file — with thousands of designs that would be slow to save and two admins
editing at once could overwrite each other. Postgres saves one row at a time and
filters in SQL, so it stays fast as the catalogue grows.

Tables are created automatically on first use. There is no migration to run.

---

## Step 1 — Create the Blob store

1. **vercel.com/dashboard** → open the **Surjay-Design-Prints** project
2. **Storage** tab → **Create Database** → **Blob** → **Continue**
3. Name it `surjay-design` → **Create**
4. Connect it to the project, **All Environments**

✅ `BLOB_READ_WRITE_TOKEN` is added for you.

## Step 2 — Create the Postgres database

1. Same **Storage** tab → **Create Database** → **Neon** → **Continue**
2. Free plan, region close to India (Singapore or Mumbai)
3. Name it `surjay-catalogue` → **Create**
4. Connect it to the project, **All Environments**

✅ `DATABASE_URL` is added for you.

## Step 3 — Create your admin account in the browser

1. Go to **/admin** on the live site
2. Because no account exists yet, you land on the **setup** screen
3. Enter your name, email and a password (at least 8 characters)
4. **Create account & sign in**

That is it. You are signed in and looking at the catalogue.

> The signing secret used for login sessions is generated automatically on first
> run and stored in the database, so sessions survive redeploys.

---

## Security of the setup screen

The setup screen only works while **zero** admin accounts exist. The moment the
first account is created it stops responding — a second attempt is rejected — and
`/admin/setup` redirects to the login page. After that, new admins are added from
inside the panel.

Because the site is already public, complete Step 3 **soon after** Steps 1 and 2,
so nobody else can claim the panel first. If you want a lock on that window, set an
`ADMIN_SETUP_TOKEN` environment variable before Step 3 and the setup screen will
also ask for it.

Passwords are never stored — only a one-way scrypt hash.

---

## Day-to-day

| Task | Where |
|---|---|
| Publish, edit, delete a design; mark Sold | **/admin** |
| Choose which product features exist and which show on the site | **/admin** → **Features** |
| Add or remove admins, change a password | **/admin** → **Team** |

## Optional environment variables

None are required. These exist for specific cases:

| Variable | Effect |
|---|---|
| `AUTH_SECRET` | Use a fixed session secret instead of the generated one |
| `ADMIN_SETUP_TOKEN` | Require a shared token on the setup screen |
| `ADMIN_USERS` | Define admins by env var instead of the database |

---

## Troubleshooting

Check **/api/admin/status** — it reports which storage is active. It is readable
without signing in only while no admin exists; afterwards it requires a session.

| What you see | What it means |
|---|---|
| Setup screen keeps reappearing | `DATABASE_URL` is missing, so the account was not persisted. Re-check Step 2 and redeploy. |
| Upload fails | Blob store is not connected. Re-check Step 1. |
| Images break but details show | Blob store was disconnected. Re-check Step 1. |
| `"activeStorage": "local filesystem"` | Neither store is connected — nothing will persist. Re-check Steps 1 and 2. |
