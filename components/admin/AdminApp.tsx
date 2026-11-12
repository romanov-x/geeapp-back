"use client";
import { useState } from "react";
import type { CmsData, PermissionId, StaffPublic } from "@/lib/cms-types";
import { StaffManager } from "./StaffManager";

type TabDef = {
  id: string;
  label: string;
  perm?: PermissionId;
};

const TABS: TabDef[] = [
  { id: "overview", label: "Обзор и бэкап" },
  { id: "catalog", label: "Модели и цены", perm: "catalog" },
  { id: "brands", label: "Марки", perm: "brands" },
  { id: "cities", label: "Города", perm: "cities" },
  { id: "sections", label: "Контент главной", perm: "sections" },
  { id: "works", label: "Портфолио работ", perm: "works" },
  { id: "faq", label: "FAQ", perm: "faq" },
  { id: "settings", label: "Контакты и документы", perm: "settings" },
  { id: "staff", label: "Сотрудники и роли", perm: "staff" },
];

export function AdminApp({
  initialInitialized,
  initialUser,
  initialCms,
}: {
  initialInitialized: boolean;
  initialUser: StaffPublic | null;
  initialCms: CmsData | null;
}) {
  const [initialized, setInitialized] = useState(initialInitialized);
  const [user, setUser] = useState<StaffPublic | null>(initialUser);
  const [cms, setCms] = useState<CmsData | null>(initialCms);
  const [activeTab, setActiveTab] = useState("overview");

  // Авторизация
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [busy, setBusy] = useState(false);
  const [backupStatus, setBackupStatus] = useState("");

  const can = (perm?: PermissionId) =>
    !perm || Boolean(user?.isOwner || user?.permissions.includes(perm));

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setBusy(true);

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: initialized ? "login" : "setup",
        email,
        password,
        name,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setAuthError(json.error || "Ошибка авторизации");
      setBusy(false);
      return;
    }

    setInitialized(true);
    setUser(json.user);

    const cmsRes = await fetch("/api/admin/cms");
    const cmsJson = await cmsRes.json();
    if (cmsRes.ok) setCms(cmsJson.data);
    setBusy(false);
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "logout" }),
    });
    setUser(null);
    setCms(null);
    setPassword("");
  }

  function exportBackup() {
    if (!cms) return;
    const blob = new Blob([JSON.stringify(cms, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `geeapp-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importBackup(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackupStatus("");
    try {
      const parsed = JSON.parse(await file.text()) as CmsData;
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullRestore: parsed }),
      });
      const json = await res.json();
      if (!res.ok) {
        setBackupStatus(json.error || "Ошибка импорта");
        return;
      }
      setCms(json.data);
      setBackupStatus("Резервная копия успешно загружена и применена ко всему сайту!");
    } catch {
      setBackupStatus("Файл повреждён или не является JSON-копией GeeApp.");
    }
  }

  if (!user) {
    return (
      <div className="adm-auth-screen">
        <form className="adm-card adm-auth-card" onSubmit={handleAuth}>
          <div className="adm-brand">
            geeapp<span>.</span> <small>admin</small>
          </div>
          <h1>
            {initialized
              ? "Вход в панель управления"
              : "Создание аккаунта владельца"}
          </h1>
          <p className="adm-muted">
            {initialized
              ? "Введите вашу рабочую почту и пароль."
              : "Первый запуск админ-панели. Задайте ваш Email и пароль главного администратора — позже вы сможете добавлять сотрудников и выдавать им права галочками."}
          </p>

          {authError && <p className="adm-alert adm-alert--error">{authError}</p>}

          {!initialized && (
            <label className="adm-field">
              <span>Ваше имя</span>
              <input
                type="text"
                required
                placeholder="Сергей"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}

          <label className="adm-field">
            <span>Электронная почта (Email)</span>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="info@geeapp.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="adm-field">
            <span>Пароль</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={initialized ? "current-password" : "new-password"}
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="adm-btn adm-btn--primary"
          >
            {busy
              ? "Подождите…"
              : initialized
              ? "Войти"
              : "Создать владельца и войти"}
          </button>
        </form>
      </div>
    );
  }

  const visibleTabs = TABS.filter((t) => can(t.perm));

  return (
    <div className="adm-shell">
      <header className="adm-topbar">
        <div className="adm-topbar-left">
          <a href="/" target="_blank" rel="noopener" className="adm-brand">
            geeapp<span>.</span> <small>CMS</small>
          </a>
          <a href="/" target="_blank" rel="noopener" className="adm-ext-link">
            Открыть сайт ↗
          </a>
        </div>

        <div className="adm-topbar-user">
          <div>
            <strong>{user.name}</strong>
            <span>
              {user.roleTitle} · {user.email}
            </span>
          </div>
          <button
            type="button"
            className="adm-btn adm-btn--ghost"
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      </header>

      <nav className="adm-tabs" aria-label="Разделы админ-панели">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`adm-tab${activeTab === tab.id ? " is-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="adm-main">
        {activeTab === "overview" && cms && (
          <div className="adm-grid-2">
            <section className="adm-card">
              <h2>Сводка базы сайта</h2>
              <div className="adm-stats-grid">
                <div className="adm-stat-box">
                  <strong>{cms.vehicles.length}</strong>
                  <span>позиций в прайсе авто</span>
                </div>
                <div className="adm-stat-box">
                  <strong>{cms.cities.length}</strong>
                  <span>городов сети</span>
                </div>
                <div className="adm-stat-box">
                  <strong>{cms.works.length}</strong>
                  <span>кейсов работ</span>
                </div>
                <div className="adm-stat-box">
                  <strong>{cms.faq.length}</strong>
                  <span>вопросов в FAQ</span>
                </div>
              </div>
              <p className="adm-muted">
                Последнее сохранение базы:{" "}
                {new Date(cms.updatedAt).toLocaleString("ru-RU")}
              </p>
            </section>

            <section className="adm-card">
              <h2>Перенос контента и резервная копия</h2>
              <p className="adm-muted">
                Все изменения сохраняются на диске сервера в{" "}
                <code>storage/cms-data.json</code>. Вы можете в любой момент
                скачать полный слепок контента (например, из Codespaces) и
                загрузить его на боевой сервер Timeweb Cloud в 1 клик.
              </p>
              {backupStatus && (
                <p className="adm-alert adm-alert--ok">{backupStatus}</p>
              )}
              <div className="adm-row-actions">
                <button
                  type="button"
                  className="adm-btn adm-btn--primary"
                  onClick={exportBackup}
                >
                  Скачать бэкап контента (.json)
                </button>
                {user.isOwner && (
                  <label className="adm-btn adm-btn--ghost adm-upload-label">
                    Восстановить из .json
                    <input
                      type="file"
                      accept="application/json"
                      hidden
                      onChange={importBackup}
                    />
                  </label>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === "staff" && can("staff") && (
          <StaffManager currentUserId={user.id} />
        )}

        {activeTab !== "overview" && activeTab !== "staff" && (
          <section className="adm-card">
            <h2>Раздел «{TABS.find((t) => t.id === activeTab)?.label}»</h2>
            <p className="adm-muted">
              База данных и права доступа подключены. Визуальные формы редактирования этого раздела подключаем на Шаге Б!
            </p>
          </section>
        )}
      </main>
    </div>
  );
}