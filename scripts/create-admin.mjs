#!/usr/bin/env node
/**
 * Create an admin account for the design-catalogue panel (local dev driver).
 *
 *   node scripts/create-admin.mjs <email> "<name>" <password>
 *   node scripts/create-admin.mjs            # interactive (password hidden-ish)
 *
 * Appends to .data/admins.json using the same scrypt scheme as the app. In
 * production these admin rows live in the database instead.
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
  id: crypto.randomUUID(),
  email,
  name: String(name).trim(),
  passwordHash: hashPassword(String(password)),
  createdAt: new Date().toISOString()
});

await fs.mkdir(DATA_DIR, { recursive: true });
await fs.writeFile(ADMINS, JSON.stringify(admins, null, 2), "utf8");
console.log(`✓ Created admin ${email}. Total admins: ${admins.length}`);
