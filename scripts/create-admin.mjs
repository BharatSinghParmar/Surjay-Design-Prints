#!/usr/bin/env node
/**
 * Create an admin account for the design-catalogue panel.
 *
 *   node scripts/create-admin.mjs                       # interactive
 *   node scripts/create-admin.mjs <email> "<Name>" <password>
 *
 * Does two things:
 *   1. Writes the account to .data/admins.json so it works locally right away.
 *   2. Prints the ADMIN_USERS value to paste into the hosting environment,
 *      which is where production reads admins from. Passwords are never stored
 *      in plain text — only a scrypt hash is kept.
 *
 * Run it once per admin; the printed ADMIN_USERS always contains everyone.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const DATA_DIR = path.join(process.cwd(), ".data");
const ADMINS = path.join(DATA_DIR, "admins.json");

function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pw, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

function stableId(email) {
  return crypto.createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 32);
}

async function read() {
  try {
    return JSON.parse(await fs.readFile(ADMINS, "utf8"));
  } catch {
    return [];
  }
}

let [, , email, name, password] = process.argv;

if (!email || !name || !password) {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  email = email || (await rl.question("Admin email: "));
  name = name || (await rl.question("Display name: "));
  password = password || (await rl.question("Password (min 8 chars): "));
  rl.close();
}

email = String(email).trim().toLowerCase();
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error("✗ Invalid email");
  process.exit(1);
}
if (String(password).length < 8) {
  console.error("✗ Password must be at least 8 characters");
  process.exit(1);
}

const admins = await read();
if (admins.some((a) => a.email.toLowerCase() === email)) {
  console.error(`✗ An admin with ${email} already exists`);
  process.exit(1);
}

admins.push({
  id: stableId(email),
  email,
  name: String(name).trim(),
  passwordHash: hashPassword(String(password)),
  createdAt: new Date().toISOString()
});

await fs.mkdir(DATA_DIR, { recursive: true });
await fs.writeFile(ADMINS, JSON.stringify(admins, null, 2), "utf8");

const envValue = JSON.stringify(
  admins.map((a) => ({ email: a.email, name: a.name, hash: a.passwordHash }))
);

console.log(`\n✓ Created admin ${email}  (total: ${admins.length})`);
console.log("  Saved to .data/admins.json — works locally straight away.\n");
console.log("─".repeat(72));
console.log("For production, set this environment variable:\n");
console.log("  Name:  ADMIN_USERS");
console.log(`  Value: ${envValue}\n`);
console.log("─".repeat(72));
console.log("Paste the whole value, including the square brackets.\n");
