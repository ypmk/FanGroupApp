import { useState } from "react";
import { login } from "../api";
import { clearUserToken, isUserLoggedIn, setUserToken } from "../auth";

export default function UserAuthModal({
                                          open,
                                          onClose,
                                      }: {
    open: boolean;
    onClose: () => void;
}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    if (!open) return null;

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            const token = await login(username, password);
            setUserToken(token);
            onClose();
        } catch (e: any) {
            setErr(e.message ?? "Login failed");
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        clearUserToken();
        onClose();
    }

    return (
        <div className="fixed inset-0 z-[100]">
            <button
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-label="close"
            />

            <div className="relative mx-auto mt-24 w-[min(520px,92vw)] rounded-3xl border border-white/10 bg-zinc-950/90 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur">
                <div className="mb-5">
                    <div className="text-xl font-semibold text-white/90">
                        {isUserLoggedIn() ? "Аккаунт" : "Вход"}
                    </div>
                    <div className="text-sm text-white/60">
                        {isUserLoggedIn()
                            ? "Вы уже вошли. Можно выйти из аккаунта."
                            : "Войдите, чтобы пользоваться корзиной и избранным."}
                    </div>
                </div>

                {isUserLoggedIn() ? (
                    <button
                        onClick={logout}
                        className="w-full rounded-2xl bg-gradient-to-r from-emerald-300 to-sky-400 px-4 py-3 font-semibold text-black/80"
                    >
                        Выйти
                    </button>
                ) : (
                    <form onSubmit={onSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-xs text-white/70">Логин</label>
                            <input
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/90 outline-none focus:border-emerald-400/30 focus:ring-4 focus:ring-emerald-400/10"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Введите логин"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-xs text-white/70">Пароль</label>
                            <input
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/90 outline-none focus:border-emerald-400/30 focus:ring-4 focus:ring-emerald-400/10"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите пароль"
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="mt-1 rounded-2xl bg-gradient-to-r from-emerald-300 to-sky-400 px-4 py-3 font-semibold text-black/80 disabled:opacity-60"
                            type="submit"
                        >
                            {loading ? "Входим..." : "Войти"}
                        </button>

                        {err && (
                            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                {err}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}
