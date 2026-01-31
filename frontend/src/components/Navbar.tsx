import { useState } from "react";
import { NavLink } from "react-router-dom";
import UserAuthModal from "./UserAuthModal";

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

function UserIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white/80"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M20 21a8 8 0 10-16 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M12 13a4 4 0 100-8 4 4 0 000 8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function Navbar() {
    const [openAuth, setOpenAuth] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                    {/* Лого */}
                    <NavLink to="/" className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-green-400/20 ring-1 ring-green-400/30" />
                        <div className="leading-tight">
                            <div className="text-base font-semibold tracking-wide text-white">
                                Elevate
                            </div>
                            <div className="text-xs text-white/60">Creative collective</div>
                        </div>
                    </NavLink>

                    {/* Меню + иконка пользователя */}
                    <div className="flex items-center gap-3">
                        <nav className="flex items-center gap-2">
                            <NavItem to="/" label="Главная" end />
                            <NavItem to="/merch" label="Мерч" />
                            <NavItem to="/studio" label="Студия" />
                        </nav>

                        <button
                            onClick={() => setOpenAuth(true)}
                            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] hover:bg-white/10 transition"
                            aria-label="user"
                            title="Войти"
                        >
                            <UserIcon />
                        </button>
                    </div>
                </div>
            </header>

            <UserAuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
        </>
    );
}
