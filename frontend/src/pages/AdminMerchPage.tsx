import { useEffect, useMemo, useState } from "react";
import {
    type MerchItem,
    adminCreateMerch,
    adminDeleteMerch,
    adminGetMerch,
    adminUpdateMerch,
} from "../api.ts";
import ConfirmModal from "../components/ConfirmModal.tsx";


type FormState = {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
};

const emptyForm: FormState = {
    title: "",
    description: "",
    price: 0,
    imageUrl: "/images/merch/bandana_1.jpg",
};

function Modal({
                   open,
                   title,
                   children,
                   onClose,
               }: {
    open: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            <button className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="close" />
            <div className="relative mx-auto mt-20 w-[min(820px,94vw)] rounded-3xl border border-white/10 bg-zinc-950/90 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                    <div className="text-lg font-semibold text-white/90">{title}</div>
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                    >
                        Закрыть
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function AdminMerchPage() {
    const [items, setItems] = useState<MerchItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const [q, setQ] = useState("");


    const [createOpen, setCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState<FormState>(emptyForm);


    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<FormState>(emptyForm);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<MerchItem | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);


    async function load() {
        setErr(null);
        setLoading(true);
        try {
            const data = await adminGetMerch();
            setItems(data);
        } catch (e: any) {
            setErr(e.message ?? "Не удалось загрузить мерч");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return items;
        return items.filter((x) => x.title.toLowerCase().includes(s));
    }, [q, items]);

    function openEdit(item: MerchItem) {
        setEditId(item.id);
        setEditForm({
            title: item.title ?? "",
            description: item.description ?? "",
            price: Number(item.price ?? 0),
            imageUrl: item.imageUrl ?? "",
        });
        setEditOpen(true);
    }

    async function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        try {
            const created = await adminCreateMerch(createForm);
            setItems((prev) => [created, ...prev]);
            setCreateForm(emptyForm);
            setCreateOpen(false);
        } catch (e: any) {
            setErr(e.message ?? "Не удалось создать товар");
        }
    }

    async function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (editId == null) return;

        setErr(null);
        try {
            const updated = await adminUpdateMerch(editId, editForm);
            setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
            setEditOpen(false);
        } catch (e: any) {
            setErr(e.message ?? "Не удалось сохранить изменения");
        }
    }

    function askDelete(item: MerchItem) {
        setDeleteItem(item);
        setDeleteOpen(true);
    }

    async function confirmDelete() {
        if (!deleteItem) return;

        setErr(null);
        setDeleteLoading(true);
        try {
            await adminDeleteMerch(deleteItem.id);
            setItems((prev) => prev.filter((x) => x.id !== deleteItem.id));
            setDeleteOpen(false);
            setDeleteItem(null);
        } catch (e: any) {
            setErr(e.message ?? "Не удалось удалить");
        } finally {
            setDeleteLoading(false);
        }
    }


    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-white/90">Мерч</h1>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        className="w-[min(360px,40vw)] rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/90 outline-none focus:border-emerald-400/30 focus:ring-4 focus:ring-emerald-400/10"
                        placeholder="Поиск по названию…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />

                    <button
                        onClick={() => setCreateOpen(true)}
                        className="rounded-2xl bg-gradient-to-r from-emerald-300 to-sky-400 px-4 py-3 text-sm font-semibold text-black/80"
                    >
                        + Добавить
                    </button>
                </div>
            </div>

            {err && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {err}
                </div>
            )}


            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
                <div className="px-5 py-4 border-b border-white/10 text-sm text-white/70 flex items-center justify-between">
                    <span>{loading ? "Загрузка…" : `Товаров: ${filtered.length}`}</span>
                </div>

                <div className="divide-y divide-white/10">
                    {!loading && filtered.length === 0 && (
                        <div className="px-5 py-10 text-center text-sm text-white/60">Ничего не найдено</div>
                    )}

                    {filtered.map((x) => (
                        <div key={x.id} className="px-5 py-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
                                    {/* картинка из public/images */}
                                    <img src={x.imageUrl} alt={x.title} className="h-full w-full object-cover" />
                                </div>

                                <div className="min-w-0">
                                    <div className="text-white/90 font-medium truncate">{x.title}</div>
                                    <div className="text-xs text-white/60 truncate">
                                        {x.description || "—"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-sm text-white/80 tabular-nums">
                                    {x.price}
                                </div>

                                <button
                                    onClick={() => openEdit(x)}
                                    className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white/85 hover:bg-white/10"
                                >
                                    Редактировать
                                </button>

                                <button
                                    onClick={() => askDelete(x)}
                                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/15"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <Modal open={createOpen} title="Добавить товар" onClose={() => setCreateOpen(false)}>
                <form onSubmit={submitCreate} className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2 md:col-span-2">
                        <label className="text-xs text-white/70">Название</label>
                        <input
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/90 outline-none focus:ring-4 focus:ring-emerald-400/10"
                            value={createForm.title}
                            onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))}
                        />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                        <label className="text-xs text-white/70">Описание</label>
                        <textarea
                            className="min-h-[96px] w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/90 outline-none focus:ring-4 focus:ring-emerald-400/10"
                            value={createForm.description}
                            onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-xs text-white/70">Цена</label>
                        <input
                            type="number"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/90 outline-none focus:ring-4 focus:ring-emerald-400/10"
                            value={createForm.price}
                            onChange={(e) => setCreateForm((p) => ({ ...p, price: Number(e.target.value) }))}
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-xs text-white/70">Image URL</label>
                        <input
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/90 outline-none focus:ring-4 focus:ring-emerald-400/10"
                            value={createForm.imageUrl}
                            onChange={(e) => setCreateForm((p) => ({ ...p, imageUrl: e.target.value }))}
                        />
                    </div>

                    <div className="md:col-span-2 flex items-center justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={() => setCreateOpen(false)}
                            className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/85 hover:bg-white/10"
                        >
                            Отмена
                        </button>

                        <button
                            type="submit"
                            className="rounded-2xl bg-gradient-to-r from-emerald-300 to-sky-400 px-4 py-3 text-sm font-semibold text-black/80"
                        >
                            Создать
                        </button>
                    </div>
                </form>
            </Modal>


            <Modal open={editOpen} title="Редактировать товар" onClose={() => setEditOpen(false)}>
                <form onSubmit={submitEdit} className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2 md:col-span-2">
                        <label className="text-xs text-white/70">Название</label>
                        <input
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/90 outline-none focus:ring-4 focus:ring-sky-400/10"
                            value={editForm.title}
                            onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                        />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                        <label className="text-xs text-white/70">Описание</label>
                        <textarea
                            className="min-h-[96px] w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/90 outline-none focus:ring-4 focus:ring-sky-400/10"
                            value={editForm.description}
                            onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-xs text-white/70">Цена</label>
                        <input
                            type="number"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/90 outline-none focus:ring-4 focus:ring-sky-400/10"
                            value={editForm.price}
                            onChange={(e) => setEditForm((p) => ({ ...p, price: Number(e.target.value) }))}
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-xs text-white/70">Image URL</label>
                        <input
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/90 outline-none focus:ring-4 focus:ring-sky-400/10"
                            value={editForm.imageUrl}
                            onChange={(e) => setEditForm((p) => ({ ...p, imageUrl: e.target.value }))}
                        />
                    </div>

                    <div className="md:col-span-2 flex items-center justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={() => setEditOpen(false)}
                            className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/85 hover:bg-white/10"
                        >
                            Отмена
                        </button>

                        <button
                            type="submit"
                            className="rounded-2xl bg-gradient-to-r from-sky-400 to-violet-400 px-4 py-3 text-sm font-semibold text-black/80"
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </Modal>


            <ConfirmModal
                open={deleteOpen}
                title="Удаление товара"
                message={deleteItem ? `Удалить "${deleteItem.title}"? Это действие нельзя отменить` : "Удалить товар?"}
                confirmText="Удалить"
                cancelText="Отмена"
                danger
                loading={deleteLoading}
                onClose={() => {
                    if (deleteLoading) return;
                    setDeleteOpen(false);
                    setDeleteItem(null);
                }}
                onConfirm={confirmDelete}
            />

        </div>
    );
}
