export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-white/90">Статистика</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="text-xs text-white/60">Товаров</div>
                    <div className="mt-2 text-3xl font-semibold">—</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="text-xs text-white/60">Пользователей</div>
                    <div className="mt-2 text-3xl font-semibold">—</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="text-xs text-white/60">Заказов</div>
                    <div className="mt-2 text-3xl font-semibold">—</div>
                </div>
            </div>
        </div>
    );
}
