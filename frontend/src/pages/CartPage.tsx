import { getUserToken } from "../auth.ts";
import { useEffect, useMemo, useState } from "react";
import {
    ApiError,
    AuthRequiredError,
    type CartItem,
    clearCart,
    getCart,
    removeFromCart,
    setCartQty,
} from "../api.ts";
import UserAuthModal from "../components/UserAuthModal.tsx";

export default function CartPage() {
    const [items, setItems] = useState<CartItem[] | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [clearing, setClearing] = useState(false);

    const [authOpen, setAuthOpen] = useState(false);
    const [token, setToken] = useState<string | null>(() => getUserToken());

    useEffect(() => {
        const t = getUserToken();
        setToken(t);
        if (!t) setAuthOpen(true);
    }, []);

    useEffect(() => {
        if (!token) return;

        (async () => {
            setErr(null);
            setItems(null);
            try {
                const data = await getCart();
                setItems(data);
            } catch (e: any) {
                if (e instanceof AuthRequiredError) {
                    setAuthOpen(true);
                    setToken(null);
                    setItems(null);
                    return;
                }
                setErr(e.message ?? "Не удалось загрузить корзину");
            }
        })();
    }, [token]);

    const totals = useMemo(() => {
        const list = items ?? [];
        const count = list.reduce((s, x) => s + (x.qty ?? 0), 0);
        const sum = list.reduce((s, x) => s + (x.qty ?? 0) * (x.price ?? 0), 0);
        return { count, sum };
    }, [items]);

    async function onDec(merchId: number, current: number) {
        if (current <= 1) return;
        await onSetQty(merchId, current - 1);
    }

    async function onInc(merchId: number, current: number) {
        await onSetQty(merchId, current + 1);
    }

    async function onSetQty(merchId: number, qty: number) {
        setErr(null);
        setBusyId(merchId);
        try {
            await setCartQty(merchId, qty);
            setItems((prev) =>
                (prev ?? []).map((x) => (x.merchId === merchId ? { ...x, qty } : x))
            );
        } catch (e: any) {
            if (
                e instanceof ApiError &&
                (e.status === 401 || e.status === 403 || e.message === "AUTH_REQUIRED")
            ) {
                setAuthOpen(true);
                setToken(null);
                setItems(null);
                return;
            }
            setErr(e.message ?? "Не удалось изменить количество");
        } finally {
            setBusyId(null);
        }
    }

    async function onRemove(merchId: number) {
        setErr(null);
        setBusyId(merchId);
        try {
            await removeFromCart(merchId);
            setItems((prev) => (prev ?? []).filter((x) => x.merchId !== merchId));
        } catch (e: any) {
            if (
                e instanceof ApiError &&
                (e.status === 401 || e.status === 403 || e.message === "AUTH_REQUIRED")
            ) {
                setAuthOpen(true);
                setToken(null);
                setItems(null);
                return;
            }
            setErr(e.message ?? "Не удалось удалить товар");
        } finally {
            setBusyId(null);
        }
    }

    async function onClear() {
        setErr(null);
        setClearing(true);
        try {
            await clearCart();
            setItems([]);
        } catch (e: any) {
            if (
                e instanceof ApiError &&
                (e.status === 401 || e.status === 403 || e.message === "AUTH_REQUIRED")
            ) {
                setAuthOpen(true);
                setToken(null);
                setItems(null);
                return;
            }
            setErr(e.message ?? "Не удалось очистить корзину");
        } finally {
            setClearing(false);
        }
    }


    if (!token) {
        return (
            <main className="mx-auto max-w-6xl px-5 py-10">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Корзина</h1>
                    <p className="mt-3 text-white/70">
                        Чтобы пользоваться корзиной, нужно войти в аккаунт
                    </p>

                    <button
                        onClick={() => setAuthOpen(true)}
                        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-green-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
                    >
                        Войти
                    </button>
                </div>

                <UserAuthModal
                    open={authOpen}
                    onClose={() => {
                        setAuthOpen(false);
                        const t = getUserToken();
                        setToken(t);
                    }}
                />
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl px-5 py-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Корзина</h1>
                </div>

                {items && items.length > 0 && (
                    <button
                        onClick={onClear}
                        disabled={clearing}
                        className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/[0.10] disabled:opacity-60"
                    >
                        {clearing ? "Очищаем…" : "Очистить корзину"}
                    </button>
                )}
            </div>

            {err && (
                <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {err}
                </div>
            )}

            {!items ? (
                <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-10 text-white/70">
                    Загрузка корзины…
                </div>
            ) : items.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-10 text-center text-white/70">
                    Корзина пуста
                </div>
            ) : (
                <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_340px]">
                    <div className="space-y-4">
                        {items.map((x) => (
                            <article
                                key={x.merchId}
                                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
                            >
                                <div className="flex gap-4 p-4 sm:p-5">
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                                        {x.imageUrl ? (
                                            <img
                                                src={x.imageUrl}
                                                alt={x.title}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-white/50">
                                                Нет фото
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="truncate text-base font-semibold text-white/90">
                                                    {x.title}
                                                </div>
                                            </div>

                                            <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold">
                                                {x.price}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-3">

                                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-2">
                                                <button
                                                    onClick={() => onDec(x.merchId, x.qty)}
                                                    disabled={busyId === x.merchId || x.qty <= 1}
                                                    className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white/90 transition hover:bg-white/10 disabled:opacity-50"
                                                    title="Уменьшить"
                                                >
                                                    −
                                                </button>

                                                <div className="min-w-12 text-center text-sm font-semibold text-white/90">
                                                    {x.qty}
                                                </div>

                                                <button
                                                    onClick={() => onInc(x.merchId, x.qty)}
                                                    disabled={busyId === x.merchId}
                                                    className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white/90 transition hover:bg-white/10 disabled:opacity-50"
                                                    title="Увеличить"
                                                >
                                                    +
                                                </button>
                                            </div>


                                            <div className="text-sm text-white/70">
                                                Сумма:{" "}
                                                <span className="font-semibold text-white/90">
                                                  {x.price * x.qty}
                                                </span>
                                            </div>


                                            <button
                                                onClick={() => onRemove(x.merchId)}
                                                disabled={busyId === x.merchId}
                                                className="ml-auto rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/[0.10] disabled:opacity-60"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>


                    <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                        <h2 className="text-base font-semibold text-white/90">Итого</h2>

                        <div className="mt-4 space-y-2 text-sm text-white/70">
                            <div className="flex items-center justify-between">
                                <span>Товаров</span>
                                <span className="font-semibold text-white/90">{totals.count}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Сумма</span>
                                <span className="font-semibold text-white/90">{totals.sum}</span>
                            </div>
                        </div>

                        <button
                            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-green-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
                            onClick={() => alert("Дальше: оформление заказа")}
                        >
                            Перейти к оформлению
                        </button>

                    </aside>
                </div>
            )}
            <UserAuthModal
                open={authOpen}
                onClose={() => {
                    setAuthOpen(false);
                    const t = getUserToken();
                    setToken(t);
                }}
            />

        </main>
    );
}
