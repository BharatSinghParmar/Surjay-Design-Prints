# Admin Design Catalogue

Owner-managed catalogue of fabric designs shown on **/products**. Admins sign in,
upload designs (JPG/PNG/WEBP/TIFF/PDF) into a category (Printed / Dyed / Custom),
tag them with admin-defined features (colour, length, GSM…), and mark them Sold.

## Local development

The dev build uses a **local driver** — no cloud accounts needed:

- design + attribute + admin records → `.data/*.json` (git-ignored)
- uploaded files → `public/uploads/` (git-ignored, served statically)

### Create an admin (multiple allowed)

```bash
node scripts/create-admin.mjs <email> "<Name>" <password>
# or run with no args for interactive prompts
```

Then sign in at **/admin/login**.

### Surfaces

| Route | Purpose |
|-------|---------|
| `/admin/login` | Sign in |
| `/admin` | Add / edit / delete designs, mark Sold, upload files |
| `/admin/attributes` | Manage the **features** — add/rename/hide/delete, and toggle which show on the site |
| `/products` | Public catalogue (filter by category, lightbox viewer, Sold badges) |

Auth is enforced **server-side** in every admin page and API route (`getCurrentAdmin`).
Middleware only does the login-redirect UX. Set `AUTH_SECRET` (see `.env.example`).

## Going live on Vercel

The architecture isolates the two infra touch-points so production is a swap, not a rewrite:

1. **Files** — replace the filesystem writes in `src/app/api/admin/upload/route.ts`
   with Vercel Blob `put()` (`BLOB_READ_WRITE_TOKEN`).
2. **Data** — reimplement the async functions in `src/lib/designs/store.ts` against
   Postgres (Neon via Vercel Marketplace, `DATABASE_URL`). Every caller is unchanged.
3. Set `AUTH_SECRET` in the Vercel project. Seed admin rows in the DB.

Nothing else (UI, API routes, validation, auth) changes.
