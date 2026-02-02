export default function ConfirmModal({
                                         open,
                                         title = "Подтвердите действие",
                                         message,
                                         confirmText = "Подтвердить",
                                         cancelText = "Отмена",
                                         danger = false,
                                         loading = false,
                                         onConfirm,
                                         onClose,
                                     }: {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
    loading?: boolean;
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[120]">
            {/* backdrop */}
            <button
                className="absolute inset-0 bg-black/60"
                onClick={loading ? undefined : onClose}
                aria-label="close"
            />

            <div className="relative mx-auto mt-24 w-[min(520px,92vw)] rounded-3xl border border-white/10 bg-zinc-950/90 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur">
                <div className="mb-2 text-lg font-semibold text-white/90">{title}</div>
                <div className="text-sm text-white/65">{message}</div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/85 hover:bg-white/10 disabled:opacity-60"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={[
                            "rounded-2xl px-4 py-3 text-sm font-semibold disabled:opacity-60",
                            danger
                                ? "bg-red-500/15 text-red-200 border border-red-500/20 hover:bg-red-500/20"
                                : "bg-gradient-to-r from-emerald-300 to-sky-400 text-black/80",
                        ].join(" ")}
                    >
                        {loading ? "Удаляем..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
