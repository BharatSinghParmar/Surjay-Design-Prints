# Admin Panel — Production Setup

One-time setup to switch on the Design Catalogue at **/admin** on the live site.
Roughly 12 minutes. You only ever do this once.

You need **two storage services** and **two environment variables**:

| What | Holds | Free tier |
|---|---|---|
| **Vercel Blob** | the uploaded design images and PDFs | 1 GB |
| **Neon Postgres** | the design records (title, category, features, sold status) | 0.5 GB |

> Why both: images do not belong in a database, and records do not belong in a
> single JSON file — with thousands of designs that would be slow to save and two
> admins editing at once could overwrite each other. Postgres saves one row at a
> time and filters in SQL, so it stays fast as the catalogue grows.

The tables are created automatically on first use — there is no migration to run.

---

## Step 1 — Create the Blob store (2 minutes)

This holds the uploaded design files.

1. Go to **https://vercel.com/dashboard**
2. Open the **Surjay-Design-Prints** project
3. Click the **Storage** tab
4. Click **Create Database** → choose **Blob** → **Continue**
5. Name it `surjay-designs` (any name is fine) → **Create**
6. When asked to connect it to a project, select **Surjay-Design-Prints** and
   connect it to **All Environments**

✅ Vercel now adds `BLOB_READ_WRITE_TOKEN` to the project automatically — you do
not need to copy or paste it.

> Free tier: 1 GB of storage. Plenty for thousands of design images.

---

## Step 1b — Create the Postgres database (2 minutes)

This holds the design records.

1. Still in the **Storage** tab, click **Create Database** again
2. Choose **Neon** (Serverless Postgres) → **Continue**
3. Accept the free plan, pick a region close to India (e.g. Singapore or Mumbai)
4. Name it `surjay-catalogue` → **Create**
5. Connect it to **Surjay-Design-Prints**, **All Environments**

✅ Vercel adds `DATABASE_URL` automatically — nothing to copy.

> The tables are created the first time the admin panel is used. No migration
> step, no SQL to run.

---

## Step 2 — Generate the login secret (1 minute)

In Terminal, from the project folder:

```bash
openssl rand -base64 32
```

Copy the output — a long random string. That is your `AUTH_SECRET`.

---

## Step 3 — Create your admin account(s) (2 minutes)

Still in Terminal:

```bash
node scripts/create-admin.mjs
```

It asks for an email, a display name and a password. Run it **once per admin** —
you can add as many people as you like.

At the end it prints a block like this:

```
  Name:  ADMIN_USERS
  Value: [{"email":"...","name":"...","hash":"..."}]
```

Copy that whole `Value`, **including the square brackets**. Your password is never
stored anywhere in plain text — only a one-way hash.

---

## Step 4 — Add the two variables to Vercel (3 minutes)

1. In the Vercel dashboard, open **Settings** → **Environment Variables**
2. Add the first one:
   - **Key:** `AUTH_SECRET`
   - **Value:** the string from Step 2
   - **Environments:** tick Production, Preview and Development
   - **Save**
3. Add the second one:
   - **Key:** `ADMIN_USERS`
   - **Value:** the JSON from Step 3
   - **Environments:** tick all three
   - **Save**

---

## Step 5 — Redeploy (1 minute)

Environment variables only apply to new deployments.

1. Go to the **Deployments** tab
2. On the most recent deployment, click the **⋯** menu → **Redeploy**
3. Confirm, and wait about a minute

---

## Step 6 — Log in and check

1. Visit **https://surjay-design-prints.vercel.app/admin/login**
2. Sign in with the email and password from Step 3
3. Click **Add Design**, upload an image, pick a category, fill in the features,
   and click **Publish Design**
4. Open **/products** — your design should appear in the catalogue

---

## Troubleshooting

| What you see | What it means |
|---|---|
| "Invalid email or password" | `ADMIN_USERS` is missing, malformed, or you redeployed before saving it. Re-check Step 4, then redeploy. |
| The page errors right after login | `AUTH_SECRET` is not set. Add it and redeploy. |
| Upload fails | The Blob store is not connected to the project. Re-check Step 1. |
| A design saves but vanishes later | `DATABASE_URL` is missing, so it fell back to temporary storage. Re-check Step 1b, then redeploy. |
| Images break but details show | The Blob store is missing or was disconnected. Re-check Step 1. |

---

## Adding another admin later

Run `node scripts/create-admin.mjs` again, copy the new `ADMIN_USERS` value
(it always contains everyone), update that variable in Vercel, and redeploy.

## Changing a password

Delete `.data/admins.json` locally, re-run the script for each person, then update
`ADMIN_USERS` in Vercel and redeploy.
