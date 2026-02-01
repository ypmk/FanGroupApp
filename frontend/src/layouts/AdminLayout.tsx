import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../auth";

function cn(isActive: boolean) {
    return [
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
        isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
    ].join(" ");
}

function Icon({ name }: { name: "chart" | "bag" | "studio" | "users" }) {
    const common = "h-4 w-4";
    switch (name) {
        case "chart":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none">
                    <path d="M4 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M8 19V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 19V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16 19V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M20 19V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            );
        case "bag":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none">
                    <path
                        d="M6 8h12l-1 13H7L6 8Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9 8a3 3 0 0 1 6 0"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            );
        case "studio":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none">
                    <path
                        d="M4 20V6a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                    <path d="M13 4v5h5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
            );
        case "users":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none">
                    <path
                        d="M17 21a7 7 0 0 0-14 0"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M22 21a6 6 0 0 0-8-5.3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            );
    }
}

export default function AdminLayout() {
    const navigate = useNavigate();

    function logout() {
        clearAdminToken();
        navigate("/admin/login", { replace: true });
    }

    return (
        <div className="h-screen bg-zinc-950 text-white">
            <div className="flex h-full">
                {/* Sidebar (полная высота экрана) */}
                <aside className="hidden md:flex h-full w-72 flex-col border-r border-white/10 bg-black/30 sticky top-0">
                    <div className="px-6 py-5 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-white/10 ring-1 ring-white/10" />
                            <div className="leading-tight">
                                <div className="text-sm font-semibold text-white/90">Admin Panel</div>
                                <div className="text-xs text-white/60">FanGroup</div>
                            </div>
                        </div>
                    </div>

                    <nav className="p-4 flex flex-col gap-2">
                        <NavLink to="/admin" end className={({ isActive }) => cn(isActive)}>
                            <Icon name="chart" />
                            Статистика
                        </NavLink>

                        <NavLink to="/admin/merch" className={({ isActive }) => cn(isActive)}>
                            <Icon name="bag" />
                            Мерч
                        </NavLink>

                        <NavLink to="/admin/studio" className={({ isActive }) => cn(isActive)}>
                            <Icon name="studio" />
                            Студия
                        </NavLink>

                        <NavLink to="/admin/users" className={({ isActive }) => cn(isActive)}>
                            <Icon name="users" />
                            Пользователи
                        </NavLink>
                    </nav>

                    <div className="mt-auto p-4 border-t border-white/10">
                        <button
                            onClick={logout}
                            className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/15 transition"
                        >
                            Выйти
                        </button>
                    </div>
                </aside>

                <main className="flex-1 min-w-0 overflow-y-auto">
                    <div className="mx-auto max-w-6xl px-5 py-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
