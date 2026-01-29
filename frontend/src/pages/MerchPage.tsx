import { useEffect, useMemo, useState } from "react";

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

    const cartCount = useMemo(
        () => Object.values(cart).reduce((a, b) => a + b, 0),
        [cart]
    );

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

    function toggleFavorite(id: number) {
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function addToCart(id: number) {
        setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    }

    if (error) {
        return (
            <main className="mx-auto max-w-6xl px-5 py-10">
                <h1 className="text-3xl font-bold tracking-tight">Мерч</h1>
                <p className="mt-3 text-red-300">Ошибка загрузки: {error}</p>
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
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl px-5 py-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Мерч</h1>
                    <p className="mt-2 text-white/70">
                        Выбирай товары и добавляй в корзину.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Badge label={`Избранное: ${favorites.size}`} />
                    <Badge label={`Корзина: ${cartCount}`} />
                </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <MerchCard
                        key={item.id}
                        item={item}
                        isFavorite={favorites.has(item.id)}
                        cartQty={cart[item.id] ?? 0}
                        onToggleFavorite={() => toggleFavorite(item.id)}
                        onAddToCart={() => addToCart(item.id)}
                    />
                ))}
            </div>
        </main>
    );
}

function Badge(props: { label: string }) {
    return (
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
            {props.label}
        </div>
    );
}

function MerchCard(props: {
    item: MerchItem;
    isFavorite: boolean;
    cartQty: number;
    onToggleFavorite: () => void;
    onAddToCart: () => void;
}) {
    const { item, isFavorite, cartQty } = props;

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

                <button
                    onClick={props.onToggleFavorite}
                    className={[
                        "absolute right-3 top-3 rounded-full px-3 py-2 text-sm font-medium transition",
                        "bg-black/40 backdrop-blur hover:bg-black/55",
                        isFavorite ? "text-green-300" : "text-white/80",
                    ].join(" ")}
                    aria-label="Добавить в избранное"
                    title="В избранное"
                >
                    {isFavorite ? "♥" : "♡"}
                </button>
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-base font-semibold leading-snug">{item.title}</h3>
                        {item.description ? (
                            <p className="mt-2 text-sm text-white/70">{item.description}</p>
                        ) : (
                            <p className="mt-2 text-sm text-white/50">Описание скоро появится</p>
                        )}
                    </div>

                    <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold">
                        {item.price}
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                    <button
                        onClick={props.onAddToCart}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-green-400"
                    >
                        В корзину
                    </button>

                    <div className="min-w-16 text-center text-sm text-white/70">
                        {cartQty > 0 ? `x${cartQty}` : ""}
                    </div>
                </div>
            </div>
        </article>
    );
}

