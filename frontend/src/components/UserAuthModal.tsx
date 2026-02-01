import { useState } from "react";
import {ApiError, login, register} from "../api";
import { clearUserToken, isUserLoggedIn, setUserToken } from "../auth";

export default function UserAuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    if (!open) return null;

    function getAuthError(e: unknown, mode: "login" | "register") {
        if (e instanceof ApiError) {
            if (mode === "register") {
                if (e.status === 409) return "Пользователь с таким логином уже существует";
                if (e.status === 400) return "Проверьте логин и пароль: логин от 3 символов, пароль от 6";
                if (e.status >= 500) return "Ошибка сервера. Попробуйте позже";
                return "Не удалось зарегистрироваться. Попробуйте ещё раз";
            }

            if (mode === "login") {
                if (e.status === 401) return "Неверный логин или пароль";
                if (e.status === 403) return "Нет доступа";
                if (e.status >= 500) return "Ошибка сервера. Попробуйте позже";
                return "Не удалось войти. Проверьте данные";
            }
        }

        return "Произошла ошибка. Попробуйте ещё раз";
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            if (mode === "register") {
                await register(username, password);
                const token = await login(username, password);
                setUserToken(token);
                onClose();
            } else {
                const token = await login(username, password);
                setUserToken(token);
                onClose();
            }
        } catch (e: any) {
            setErr(getAuthError(e, mode));
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
            <button className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="close" />

            <div className="relative mx-auto mt-24 w-[min(520px,92vw)] rounded-3xl border border-white/10 bg-zinc-950/90 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <div className="text-xl font-semibold text-white/90">
                            {isUserLoggedIn() ? "Аккаунт" : mode === "login" ? "Вход" : "Регистрация"}
                        </div>
                        <div className="text-sm text-white/60">
                            {isUserLoggedIn()
                                ? "Вы уже вошли"
                                : mode === "login"
                                    ? "Войдите, чтобы пользоваться корзиной и избранным"
                                    : "Создайте аккаунт, чтобы пользоваться корзиной и избранным"}
                        </div>
                    </div>

                    {!isUserLoggedIn() && (
                        <div className="flex rounded-2xl bg-white/5 p-1 border border-white/10">
                            <button
                                className={`px-3 py-2 text-sm rounded-xl ${mode === "login" ? "bg-white/10 text-white" : "text-white/70"}`}
                                onClick={() => setMode("login")}
                                type="button"
                            >
                                Вход
                            </button>
                            <button
                                className={`px-3 py-2 text-sm rounded-xl ${mode === "register" ? "bg-white/10 text-white" : "text-white/70"}`}
                                onClick={() => setMode("register")}
                                type="button"
                            >
                                Регистрация
                            </button>
                        </div>
                    )}
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
                            {loading ? "Подождите..." : mode === "login" ? "Войти" : "Создать аккаунт"}
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
