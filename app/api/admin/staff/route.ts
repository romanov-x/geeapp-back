import crypto from "node:crypto";
import { NextResponse } from "next/server";
import {
  getAllUsers,
  getCurrentAdmin,
  hashPassword,
   hasPermission,
  saveAllUsers,
  toPublicUser,
} from "@/lib/auth";
import { PERMISSIONS, type PermissionId, type StaffUser } from "@/lib/cms-types";

const VALID_PERMS = new Set<string>(PERMISSIONS.map((p) => p.id));

function cleanPerms(input: unknown): PermissionId[] {
  if (!Array.isArray(input)) return [];
  return input.filter(
    (p): p is PermissionId => typeof p === "string" && VALID_PERMS.has(p)
  );
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!hasPermission(admin, "staff")) {
    return NextResponse.json({ error: "Нет прав доступа." }, { status: 403 });
  }
  return NextResponse.json({
    staff: getAllUsers().map(toPublicUser),
  });
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!hasPermission(admin, "staff")) {
    return NextResponse.json({ error: "Нет прав доступа." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    name?: string;
    roleTitle?: string;
    password?: string;
    permissions?: string[];
  };

  const email = (body.email || "").trim().toLowerCase();
  const name = (body.name || "").trim();
  const roleTitle = (body.roleTitle || "").trim() || "Сотрудник";
  const password = body.password || "";
  const permissions = cleanPerms(body.permissions);

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Укажите корректный email сотрудника." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Укажите имя сотрудника." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Задайте стартовый пароль сотруднику (минимум 6 символов)." },
      { status: 400 }
    );
  }

  const users = getAllUsers();
  if (users.some((u) => u.email === email)) {
    return NextResponse.json(
      { error: "Сотрудник с таким email уже существует." },
      { status: 409 }
    );
  }

  const created: StaffUser = {
    id: crypto.randomUUID(),
    email,
    name,
    roleTitle,
    isOwner: false,
    active: true,
    permissions,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(created);
  saveAllUsers(users);

  return NextResponse.json({ staff: users.map(toPublicUser) });
}

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!hasPermission(admin, "staff")) {
    return NextResponse.json({ error: "Нет прав доступа." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    id?: string;
    email?: string;
    name?: string;
    roleTitle?: string;
    active?: boolean;
    password?: string;
    permissions?: string[];
  };

  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === body.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Сотрудник не найден." }, { status: 404 });
  }

  const target = { ...users[idx] };

  if (typeof body.name === "string" && body.name.trim()) {
    target.name = body.name.trim();
  }
  if (typeof body.roleTitle === "string" && body.roleTitle.trim()) {
    target.roleTitle = body.roleTitle.trim();
  }
  if (typeof body.email === "string" && body.email.includes("@")) {
    const nextEmail = body.email.trim().toLowerCase();
    if (users.some((u, i) => i !== idx && u.email === nextEmail)) {
      return NextResponse.json({ error: "Этот email уже занят." }, { status: 409 });
    }
    target.email = nextEmail;
  }
  if (!target.isOwner) {
    if (typeof body.active === "boolean") target.active = body.active;
    if (body.permissions) target.permissions = cleanPerms(body.permissions);
  }
  if (typeof body.password === "string" && body.password.length >= 6) {
    target.passwordHash = hashPassword(body.password);
  }

  users[idx] = target;
  saveAllUsers(users);

  return NextResponse.json({ staff: users.map(toPublicUser) });
}

export async function DELETE(request: Request) {
  const admin = await getCurrentAdmin();
  if (!hasPermission(admin, "staff")) {
    return NextResponse.json({ error: "Нет прав доступа." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const users = getAllUsers();
  const target = users.find((u) => u.id === id);

  if (!target) {
    return NextResponse.json({ error: "Сотрудник не найден." }, { status: 404 });
  }
  if (target.isOwner) {
    return NextResponse.json(
      { error: "Нельзя удалить главного администратора." },
      { status: 400 }
    );
  }

  const next = users.filter((u) => u.id !== id);
  saveAllUsers(next);
  return NextResponse.json({ staff: next.map(toPublicUser) });
}