import { NavLink } from "react-router-dom";

function NavItem(props: { to: string; label: string; end?: boolean }) {
    return (
        <NavLink
            to={props.to}
            end={props.end}
            className={({ isActive }) =>
                [
                    "rounded-xl px-3 py-2 text-sm font-medium transition",
                    "hover:bg-white/10",
                    isActive ? "bg-white/10 text-white" : "text-white/75",
                ].join(" ")
            }
        >
            {props.label}
        </NavLink>
    );
}

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                {/* Лого (пока заглушка квадратом) */}
                <NavLink to="/" className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-green-400/20 ring-1 ring-green-400/30" />
                    <div className="leading-tight">
                        <div className="text-base font-semibold tracking-wide">Elevate</div>
                        <div className="text-xs text-white/60">Creative collective</div>
                    </div>
                </NavLink>

                {/* Меню */}
                <nav className="flex items-center gap-2">
                    <NavItem to="/" label="Главная" end />
                    <NavItem to="/merch" label="Мерч" />
                    <NavItem to="/studio" label="Студия" />
                </nav>
            </div>
        </header>
    );
}
