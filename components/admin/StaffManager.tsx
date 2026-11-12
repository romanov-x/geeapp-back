"use client";
import { useEffect, useState } from "react";
import {
  PERMISSIONS,
  type PermissionId,
  type StaffPublic,
} from "@/lib/cms-types";

export function StaffManager({ currentUserId }: { currentUserId: string }) {
  const [staff, setStaff] = useState<StaffPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Поля нового сотрудника
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [roleTitle, setRoleTitle] = useState("Контент-менеджер");
  const [password, setPassword] = useState("");
  const [perms, setPerms] = useState<PermissionId[]>(["catalog", "works", "faq"]);

  // Редактируемый сотрудник
  const [editing, setEditing] = useState<StaffPublic | null>(null);
  const [newPass, setNewPass] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/staff");
    const json = await res.json();
    if (res.ok) setStaff(json.staff || []);
    else setError(json.error || "Ошибка загрузки сотрудников");
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function togglePerm(list: PermissionId[], id: PermissionId): PermissionId[] {
    return list.includes(id) ? list.filter((p) => p !== id) : [...list, id];
  }

  async function createStaff(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    const res = await fetch("/api/admin/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        roleTitle,
        password,
        permissions: perms,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Не удалось добавить сотрудника");
      return;
    }
    setStaff(json.staff);
    setEmail("");
    setName("");
    setPassword("");
    setNotice("Сотрудник добавлен. Теперь он может войти в /admin по своей почте.");
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setError("");
    setNotice("");
    const res = await fetch("/api/admin/staff", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        email: editing.email,
        name: editing.name,
        roleTitle: editing.roleTitle,
        active: editing.active,
        permissions: editing.permissions,
        ...(newPass ? { password: newPass } : {}),
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Не удалось сохранить изменения");
      return;
    }
    setStaff(json.staff);
    setEditing(null);
    setNewPass("");
    setNotice("Права и данные сотрудника обновлены.");
  }

  async function removeStaff(user: StaffPublic) {
    if (!confirm(`Удалить сотрудника ${user.name} (${user.email})?`)) return;
    const res = await fetch(`/api/admin/staff?id=${encodeURIComponent(user.id)}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (res.ok) {
      setStaff(json.staff);
      setNotice("Сотрудник удалён.");
    } else {
      setError(json.error || "Ошибка удаления");
    }
  }

  return (
    <div className="adm-grid-2">
      <section className="adm-card">
        <h2>Сотрудники ({staff.length})</h2>
        <p className="adm-muted">
          Каждый сотрудник входит на страницу <code>/admin</code> по своей электронной почте и видит только отмеченные вами разделы.
        </p>

        {error && <p className="adm-alert adm-alert--error">{error}</p>}
        {notice && <p className="adm-alert adm-alert--ok">{notice}</p>}

        {loading ? (
          <p className="adm-muted">Загрузка списка…</p>
        ) : (
          <div className="adm-list">
            {staff.map((u) => (
              <div key={u.id} className="adm-staff-row">
                <div>
                  <div className="adm-staff-head">
                    <strong>{u.name}</strong>
                    <span className="adm-badge">{u.roleTitle}</span>
                    {!u.active && (
                      <span className="adm-badge adm-badge--warn">Отключён</span>
                    )}
                    {u.id === currentUserId && (
                      <span className="adm-badge adm-badge--accent">Вы</span>
                    )}
                  </div>
                  <div className="adm-staff-email">{u.email}</div>
                  <div className="adm-perm-tags">
                    {u.isOwner ? (
                      <span className="adm-perm-chip">Полный доступ ко всем разделам</span>
                    ) : u.permissions.length ? (
                      u.permissions.map((pid) => (
                        <span key={pid} className="adm-perm-chip">
                          {PERMISSIONS.find((p) => p.id === pid)?.label || pid}
                        </span>
                      ))
                    ) : (
                      <span className="adm-muted">Права не выбраны</span>
                    )}
                  </div>
                </div>
                <div className="adm-row-actions">
                  <button
                    type="button"
                    className="adm-btn adm-btn--ghost"
                    onClick={() => {
                      setEditing({ ...u });
                      setNewPass("");
                    }}
                  >
                    Настроить
                  </button>
                  {!u.isOwner && (
                    <button
                      type="button"
                      className="adm-btn adm-btn--danger"
                      onClick={() => removeStaff(u)}
                    >
                      Удалить
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="adm-card">
        {editing ? (
          <form onSubmit={saveEdit} className="adm-form">
            <div className="adm-card-head">
              <h2>Редактировать: {editing.name}</h2>
              <button
                type="button"
                className="adm-btn adm-btn--ghost"
                onClick={() => setEditing(null)}
              >
                Отмена
              </button>
            </div>

            <label className="adm-field">
              <span>Email для входа</span>
              <input
                type="email"
                required
                value={editing.email}
                onChange={(e) => setEditing({ ...editing, email: e.target.value })}
              />
            </label>

            <div className="adm-row-2">
              <label className="adm-field">
                <span>Имя</span>
                <input
                  type="text"
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </label>
              <label className="adm-field">
                <span>Название роли</span>
                <input
                  type="text"
                  required
                  value={editing.roleTitle}
                  onChange={(e) =>
                    setEditing({ ...editing, roleTitle: e.target.value })
                  }
                />
              </label>
            </div>

            <label className="adm-field">
              <span>Новый пароль (оставьте пустым, чтобы не менять)</span>
              <input
                type="password"
                minLength={6}
                placeholder="Минимум 6 символов"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </label>

            {!editing.isOwner && (
              <>
                <label className="adm-check">
                  <input
                    type="checkbox"
                    checked={editing.active}
                    onChange={(e) =>
                      setEditing({ ...editing, active: e.target.checked })
                    }
                  />
                  <span>Учётная запись активна (разрешить вход)</span>
                </label>

                <fieldset className="adm-fieldset">
                  <legend>Возможности сотрудника (галочки доступа)</legend>
                  {PERMISSIONS.map((perm) => (
                    <label key={perm.id} className="adm-check adm-check--card">
                      <input
                        type="checkbox"
                        checked={editing.permissions.includes(perm.id)}
                        onChange={() =>
                          setEditing({
                            ...editing,
                            permissions: togglePerm(editing.permissions, perm.id),
                          })
                        }
                      />
                      <div>
                        <strong>{perm.label}</strong>
                        <small>{perm.description}</small>
                      </div>
                    </label>
                  ))}
                </fieldset>
              </>
            )}

            <button type="submit" className="adm-btn adm-btn--primary">
              Сохранить сотрудника
            </button>
          </form>
        ) : (
          <form onSubmit={createStaff} className="adm-form">
            <h2>Добавить сотрудника</h2>
            <p className="adm-muted">
              Укажите почту сотрудника, произвольное название роли и отметьте галочками нужные возможности.
            </p>

            <label className="adm-field">
              <span>Email сотрудника (логин)</span>
              <input
                type="email"
                required
                placeholder="manager@geeapp.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <div className="adm-row-2">
              <label className="adm-field">
                <span>Имя сотрудника</span>
                <input
                  type="text"
                  required
                  placeholder="Алексей"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="adm-field">
                <span>Название роли</span>
                <input
                  type="text"
                  required
                  placeholder="Контент-менеджер / Администратор"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                />
              </label>
            </div>

            <label className="adm-field">
              <span>Пароль для входа</span>
              <input
                type="text"
                required
                minLength={6}
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <fieldset className="adm-fieldset">
              <legend>Возможности сотрудника</legend>
              {PERMISSIONS.map((perm) => (
                <label key={perm.id} className="adm-check adm-check--card">
                  <input
                    type="checkbox"
                    checked={perms.includes(perm.id)}
                    onChange={() => setPerms(togglePerm(perms, perm.id))}
                  />
                  <div>
                    <strong>{perm.label}</strong>
                    <small>{perm.description}</small>
                  </div>
                </label>
              ))}
            </fieldset>

            <button type="submit" className="adm-btn adm-btn--primary">
              Создать сотрудника
            </button>
          </form>
        )}
      </section>
    </div>
  );
}