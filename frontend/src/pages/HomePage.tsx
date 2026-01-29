import { Link } from "react-router-dom";

export function HomePage() {
    return (
        <main className="mx-auto max-w-5xl px-5 py-10">
            <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 shadow-sm">

                <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                    Творческий коллектив <span className="text-green-400">Elevate</span>
                </h1>

                <p className="mt-4 max-w-2xl text-white/70 leading-relaxed">
                    Новости, мерч и студия танцев. Здесь можно выбрать товары, записаться на
                    мастер-класс и купить абонемент.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                        to="/merch"
                        className="inline-flex items-center justify-center rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
                    >
                        Перейти в мерч
                    </Link>

                    <Link
                        to="/studio"
                        className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                        Перейти в студию
                    </Link>
                </div>
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-3">
                <InfoCard title="Мерч">
                    Каталог товаров и оформление заказа.
                </InfoCard>

                <InfoCard title="Студия">
                    Запись на мастер-классы и абонементы.
                </InfoCard>

                <InfoCard title="События">
                    Анонсы выступлений и расписание.
                </InfoCard>
            </section>
        </main>
    );
}

function InfoCard(props: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-base font-semibold">{props.title}</div>
            <div className="mt-2 text-sm text-white/70 leading-relaxed">
                {props.children}
            </div>
        </div>
    );
}
