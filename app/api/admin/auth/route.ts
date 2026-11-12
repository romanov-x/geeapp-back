import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createInitialOwner,
  createSessionToken,
  getAllUsers,
  getCurrentAdmin,
  hasAnyUsers,
  toPublicUser,
  verifyPassword,
} from "@/lib/auth";

export async function GET() {
  const user = await getCurrentAdmin();
  return NextResponse.json({
    initialized: hasAnyUsers(),
    user,
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    mode?: "login" | "setup" | "logout";
    email?: string;
    password?: string;
    name?: string;
  };

  if (body.mode === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Укажите корректный email." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Пароль должен содержать минимум 6 символов." },
      { status: 400 }
    );
  }

  // Первичная регистрация главного администратора при первом запуске
  if (body.mode === "setup") {
    if (hasAnyUsers()) {
      return NextResponse.json(
        { error: "Администратор уже настроен. Войдите по email и паролю." },
        { status: 403 }
      );
    }
    const owner = createInitialOwner({
      email,
      name: body.name || "Администратор",
      password,
    });
    const token = createSessionToken(owner.id);
    const res = NextResponse.json({ user: toPublicUser(owner) });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    return res;
  }

  // Вход существующего администратора или сотрудника по Email
  const user = getAllUsers().find((u) => u.email === email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { error: "Неверный email или пароль." },
      { status: 401 }
    );
  }
  if (!user.active) {
    return NextResponse.json(
      { error: "Доступ для этого сотрудника приостановлен администратором." },
      { status: 403 }
    );
  }

  const token = createSessionToken(user.id);
  const res = NextResponse.json({ user: toPublicUser(user) });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}