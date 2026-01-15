import { NavLink } from "react-router-dom";

const base =
    "rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/10";
const active = "bg-white/10 text-white";
const inactive = "text-white/75";

export function Navbar() {
    return (
        <header className="border-b border-white/10 bg-zinc-950/60 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
                <div className="text-lg font-semibold tracking-wide">FanGroup</div>

                <nav className="flex items-center gap-2">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `${base} ${isActive ? active : inactive}`
                        }
                    >
                        Главная
                    </NavLink>

                    <NavLink
                        to="/merch"
                        className={({ isActive }) =>
                            `${base} ${isActive ? active : inactive}`
                        }
                    >
                        Мерч
                    </NavLink>

                    <NavLink
                        to="/studio"
                        className={({ isActive }) =>
                            `${base} ${isActive ? active : inactive}`
                        }
                    >
                        Студия
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}