import { useEffect, useMemo, useState } from "react";
import {adminGetUsers, adminGrantAdmin, adminRevokeAdmin, type AdminUser} from "../api.ts";


function hasAdmin(u: AdminUser) {
    return u.roles.includes("ROLE_ADMIN");
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [q, setQ] = useState("");

    useEffect(() => {
        (async () => {
            setErr(null);
            setLoading(true);
            try {
                const data = await adminGetUsers();
                setUsers(data);
            } catch (e: any) {
                setErr(e.message ?? "Не удалось загрузить пользователей");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return users;
        return users.filter(u => u.username.toLowerCase().includes(s));
    }, [q, users]);

    async function toggleAdmin(u: AdminUser) {
        setErr(null);
        try {
            const updated = hasAdmin(u)
                ? await adminRevokeAdmin(u.id)
                : await adminGrantAdmin(u.id);

            setUsers(prev => prev.map(x => (x.id === updated.id ? updated : x)));
        } catch (e: any) {
            setErr(e.message ?? "Не удалось изменить роль");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-white/90">Пользователи</h1>
                </div>

                <input
                    className="w-[min(340px,45vw)] rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/90 outline-none focus:border-emerald-400/30 focus:ring-4 focus:ring-emerald-400/10"
                    placeholder="Поиск по логину…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>

            {err && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {err}
                </div>
            )}

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
                <div className="px-5 py-4 border-b border-white/10 text-sm text-white/70">
                    {loading ? "Загрузка…" : `Найдено: ${filtered.length}`}
                </div>

                <div className="divide-y divide-white/10">
                    {filtered.map((u) => (
                        <div key={u.id} className="px-5 py-4 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <div className="text-white/90 font-medium truncate">
                                    {u.username}
                                </div>
                                <div className="text-xs text-white/60">
                                    id: {u.id} • роли: {u.roles.join(", ") || "—"}
                                </div>
                            </div>

                            <button
                                onClick={() => toggleAdmin(u)}
                                className={[
                                    "shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold transition border",
                                    hasAdmin(u)
                                        ? "border-white/15 bg-white/10 text-white/90 hover:bg-white/15"
                                        : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15",
                                ].join(" ")}
                            >
                                {hasAdmin(u) ? "Снять admin" : "Сделать admin"}
                            </button>
                        </div>
                    ))}

                    {!loading && filtered.length === 0 && (
                        <div className="px-5 py-10 text-center text-sm text-white/60">
                            Никого не найдено
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

