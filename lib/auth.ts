import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import {
  PERMISSIONS,
  type PermissionId,
  type StaffPublic,
  type StaffUser,
} from "./cms-types";

export const SESSION_COOKIE = "geeapp_admin_session";
const STORAGE_DIR = path.join(process.cwd(), "storage");
const USERS_FILE = path.join(STORAGE_DIR, "staff-users.json");
const SECRET_FILE = path.join(STORAGE_DIR, "session-secret.key");

function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

function getSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  ensureStorage();
  if (!fs.existsSync(SECRET_FILE)) {
    const generated = crypto.randomBytes(32).toString("hex");
    fs.writeFileSync(SECRET_FILE, generated, { mode: 0o600 });
    return generated;
  }
  return fs.readFileSync(SECRET_FILE, "utf8").trim();
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, "hex");
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

export function getAllUsers(): StaffUser[] {
  ensureStorage();
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8")) as StaffUser[];
  } catch {
    return [];
  }
}

export function saveAllUsers(users: StaffUser[]) {
  ensureStorage();
  const tmp = `${USERS_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(users, null, 2) + "\n", { mode: 0o600 });
  fs.renameSync(tmp, USERS_FILE);
}

export function toPublicUser(user: StaffUser): StaffPublic {
  const { passwordHash: _, ...pub } = user;
  return pub;
}

export function hasAnyUsers(): boolean {
  return getAllUsers().length > 0;
}

export function createInitialOwner(params: {
  email: string;
  name: string;
  password: string;
}): StaffUser {
  if (hasAnyUsers()) {
    throw new Error("Главный администратор уже создан.");
  }
  const allPerms = PERMISSIONS.map((p) => p.id);
  const owner: StaffUser = {
    id: crypto.randomUUID(),
    email: params.email.trim().toLowerCase(),
    name: params.name.trim() || "Владелец",
    roleTitle: "Главный администратор",
    isOwner: true,
    active: true,
    permissions: allPerms,
    passwordHash: hashPassword(params.password),
    createdAt: new Date().toISOString(),
  };
  saveAllUsers([owner]);
  return owner;
}

export function createSessionToken(userId: string): string {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 14; // 14 дней
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp })).toString(
    "base64url"
  );
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token?: string | null): StaffUser | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  if (sig !== expected) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { uid: string; exp: number };
    if (Date.now() > parsed.exp) return null;
    const user = getAllUsers().find((u) => u.id === parsed.uid && u.active);
    return user || null;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<StaffPublic | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const user = verifySessionToken(token);
  return user ? toPublicUser(user) : null;
}

export function hasPermission(
  user: StaffPublic | null,
  perm: PermissionId
): boolean {
  if (!user || !user.active) return false;
  if (user.isOwner) return true;
  return user.permissions.includes(perm);
}