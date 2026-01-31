import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { login } from "../api";
import { setAdminToken } from "../auth";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const navigate = useNavigate();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            const token = await login(username, password);
            setAdminToken(token);
            navigate("/admin/merch", { replace: true });
        } catch (e: any) {
            setErr(e.message ?? "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            rightTitle="Вход администратора"
            leftVariant="minimal"
            showBottomLink={false}
        >
            <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-2">
                    <label className="text-xs text-white/70">Логин</label>
                    <input
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/90 outline-none focus:border-sky-400/30 focus:ring-4 focus:ring-sky-400/10"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Введите логин"
                    />
                </div>

                <div className="grid gap-2">
                    <label className="text-xs text-white/70">Пароль</label>
                    <input
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/90 outline-none focus:border-sky-400/30 focus:ring-4 focus:ring-sky-400/10"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите пароль"
                    />
                </div>

                <button
                    disabled={loading}
                    className="mt-1 rounded-2xl bg-gradient-to-r from-sky-400 to-violet-400 px-4 py-3 font-semibold text-black/80 shadow-lg shadow-sky-400/10 disabled:opacity-60"
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
        </AuthLayout>
    );
}
