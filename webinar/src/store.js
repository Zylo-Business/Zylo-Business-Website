import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Simple, dependency-free JSON datastore. Registrations live in data/registrations.json.
// Reads are served from memory; writes are atomic (temp file + rename) so the file is
// never left half-written. This keeps the leads list in its OWN backend with no external
// database to provision — swap this module for SQLite/Postgres later without touching the API.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DB_FILE = path.join(DATA_DIR, "registrations.json");

let cache = null;
let writeChain = Promise.resolve();

async function load() {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    cache = JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") cache = [];
    else throw err;
  }
  return cache;
}

async function persist() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(cache, null, 2), "utf8");
  await fs.rename(tmp, DB_FILE);
}

// Serialise writes so concurrent requests never clobber each other.
function queueWrite(fn) {
  writeChain = writeChain.then(fn, fn);
  return writeChain;
}

export async function addRegistration(reg) {
  await load();
  return queueWrite(async () => {
    cache.push(reg);
    await persist();
    return reg;
  });
}

export async function findByReference(reference) {
  const all = await load();
  return all.find((r) => r.reference === reference) || null;
}

export async function findByEmail(email) {
  const all = await load();
  const lower = String(email).toLowerCase();
  return all.filter((r) => r.email.toLowerCase() === lower);
}

export async function updateByReference(reference, patch) {
  await load();
  return queueWrite(async () => {
    const reg = cache.find((r) => r.reference === reference);
    if (!reg) return null;
    Object.assign(reg, patch);
    await persist();
    return reg;
  });
}

export async function allRegistrations() {
  const all = await load();
  return [...all].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function stats() {
  const all = await load();
  return {
    total: all.length,
    paid: all.filter((r) => r.status === "paid").length,
    pending: all.filter((r) => r.status === "pending").length,
    revenueGhs: all
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + (Number(r.priceGhs) || 0), 0),
  };
}
