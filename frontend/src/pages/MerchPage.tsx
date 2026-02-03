import { useEffect, useMemo, useState } from "react";
import UserAuthModal from "../components/UserAuthModal";
import { addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, getCart, type CartItem, AuthRequiredError } from "../api";
import { getUserToken } from "../auth";
import {Link} from "react-router-dom";

type MerchItem = {
    id: number;
    title: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
};

export function MerchPage() {
    const [items, setItems] = useState<MerchItem[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [favorites, setFavorites] = useState<Set<number>>(new Set());


    const [cart, setCart] = useState<Record<number, number>>({});

    const [authOpen, setAuthOpen] = useState(false);

    const token = getUserToken();

    const cartCount = useMemo(
        () => Object.values(cart).reduce((a, b) => a + b, 0),
        [cart]
    );

    const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());


    function setPending(id: number, value: boolean) {
        setPendingIds((prev) => {
            const next = new Set(prev);
            if (value) next.add(id);
            else next.delete(id);
            return next;
        });
    }


    function toggleFavorite(id: number) {
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    async function loadCartFromServer() {
        if (!getUserToken()) return;

        try {
            const list: CartItem[] = await getCart();
            const map: Record<number, number> = {};
            for (const x of list) map[x.merchId] = x.qty ?? 0;
            setCart(map);
        } catch (e: any) {
            if (e instanceof AuthRequiredError) {
                setAuthOpen(true);
                setCart({});
                return;
            }
        }
    }

    useEffect(() => {
        setError(null);
        setItems(null);

        fetch("/api/merch")
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((data: MerchItem[]) => setItems(data))
            .catch((e) => setError(e.message));
    }, []);


    useEffect(() => {
        if (!token) return;
        loadCartFromServer();
    }, [token]);


    async function toggleCart(id: number) {
        if (!getUserToken()) {
            setAuthOpen(true);
            return;
        }

        if (pendingIds.has(id)) return;

        const wasQty = cart[id] ?? 0;
        const willRemove = wasQty > 0;

        setPending(id, true);

        setCart((prev) => {
            const next = { ...prev };
            if (willRemove) {
                delete next[id];
            } else {
                next[id] = 1;
            }
            return next;
        });

        try {
            if (willRemove) {
                await apiRemoveFromCart(id);
            } else {
                await apiAddToCart(id);
            }
        } catch (e: any) {
            setCart((prev) => {
                const next = { ...prev };
                if (wasQty > 0) next[id] = wasQty;
                else delete next[id];
                return next;
            });

            if (e instanceof AuthRequiredError) {
                setAuthOpen(true);
                return;
            }
            setError(e.message ?? "Не удалось обновить корзину");
        } finally {
            setPending(id, false);
        }
    }


    if (error) {
        return (
            <main className="mx-auto max-w-6xl px-5 py-10">
                <h1 className="text-3xl font-bold tracking-tight">Мерч</h1>
                <p className="mt-3 text-red-300">Ошибка: {error}</p>

                <UserAuthModal
                    open={authOpen}
                    onClose={() => {
                        setAuthOpen(false);
                        loadCartFromServer();
                    }}
                />
            </main>
        );
    }

    if (!items) {
        return (
            <main className="mx-auto max-w-6xl px-5 py-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Мерч</h1>
                        <p className="mt-2 text-white/70">Загрузка...</p>
                    </div>
                </div>

                <UserAuthModal
                    open={authOpen}
                    onClose={() => {
                        setAuthOpen(false);
                        loadCartFromServer();
                    }}
                />
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl px-5 py-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Мерч</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/cart"
                        className=" inline-flex items-center gap-2
                                    rounded-full px-4 py-2
                                    bg-white/5 text-white/90
                                    border border-white/10
                                    backdrop-blur
                                    shadow-sm shadow-black/20
                                    hover:bg-white/10 hover:border-white/20
                                    active:scale-[0.98]
                                    transition
                                    focus:outline-none focus:ring-2 focus:ring-white/20">
                        <span className="text-sm font-medium">Корзина</span>
                        <span
                            className="inline-flex items-center justify-center
                              min-w-7 h-7 px-2
                              rounded-full
                              bg-white/10 border border-white/10
                              text-sm font-semibold">
                              {cartCount}
                        </span>
                    </Link>

                </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <MerchCard
                        key={item.id}
                        item={item}
                        isFavorite={favorites.has(item.id)}
                        cartQty={cart[item.id] ?? 0}
                        cartPending={pendingIds.has(item.id)}
                        onToggleFavorite={() => toggleFavorite(item.id)}
                        onToggleCart={() => toggleCart(item.id)}
                    />
                ))}
            </div>

            <UserAuthModal
                open={authOpen}
                onClose={() => {
                    setAuthOpen(false);
                    loadCartFromServer();
                }}
            />
        </main>
    );
}


function MerchCard(props: {
    item: MerchItem;
    isFavorite: boolean;
    cartQty: number;
    cartPending: boolean;
    onToggleFavorite: () => void;
    onToggleCart: () => void;
}) {

    const inCart = props.cartQty > 0;
    const {item} = props;

    return (
        <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm transition hover:border-white/20">
            <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/50">
                        Нет фото
                    </div>
                )}

            </div>

            <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="min-w-0 text-lg font-semibold leading-tight">
                        <span className="block truncate">{item.title}</span>
                    </h3>

                    <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold tabular-nums text-white/90">
                        {item.price} ₽
                    </div>
                </div>

                <p className="mt-2 text-sm text-white/60 line-clamp-2">
                    {item.description ?? "Описание скоро появится"}
                </p>

                <button
                    onClick={props.onToggleCart}
                    disabled={props.cartPending}
                    className={[
                        "flex w-full items-center justify-center",
                        "rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                        "active:scale-[0.99] focus:outline-none focus:ring-2",
                        props.cartPending ? "opacity-70 cursor-not-allowed" : "",
                        inCart
                            ? "bg-white/10 text-white hover:bg-white/15 border border-white/15 focus:ring-white/20"
                            : "bg-green-500 text-black hover:bg-green-400 focus:ring-green-300/30",
                    ].join(" ")}
                >
                    {props.cartPending
                        ? inCart
                            ? "Удаляем..."
                            : "Добавляем..."
                        : inCart
                            ? "Удалить из корзины"
                            : "В корзину"}
                </button>

            </div>


        </article>
    );
}
