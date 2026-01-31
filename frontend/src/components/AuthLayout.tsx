import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
    rightTitle: string;
    children: ReactNode;


    leftVariant?: "minimal" | "text";


    title?: string;
    subtitle?: string;


    showBottomLink?: boolean;
    bottomLeftText?: string;
    bottomRightLinkText?: string;
    bottomRightLinkTo?: string;
};

export default function AuthLayout({
                                       rightTitle,
                                       children,
                                       leftVariant = "text",
                                       title,
                                       subtitle,
                                       showBottomLink = true,
                                       bottomLeftText,
                                       bottomRightLinkText,
                                       bottomRightLinkTo,
                                   }: Props) {
    return (
        <div className="min-h-[calc(100vh-80px)] px-4 py-10 flex items-center justify-center">
            <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
                <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr]">
                    {/* Left */}
                    <div className="relative border-b md:border-b-0 md:border-r border-white/10 p-10">
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute -top-32 -left-28 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
                            <div className="absolute top-10 -right-24 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
                            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
                        </div>

                        {leftVariant === "text" && (
                            <div className="relative flex flex-col gap-4 justify-center h-full">
                                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white/95">
                                    {title}
                                </h1>
                                <p className="text-sm leading-relaxed text-white/70 max-w-[44ch]">
                                    {subtitle}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right */}
                    <div className="p-10 bg-black/20">
                        <h2 className="text-2xl font-semibold text-white/90 mb-6">
                            {rightTitle}
                        </h2>

                        {children}

                        {showBottomLink && bottomRightLinkTo && (
                            <div className="mt-6 flex items-center justify-between gap-3 text-sm text-white/60">
                                <span>{bottomLeftText}</span>
                                <Link
                                    to={bottomRightLinkTo}
                                    className="text-emerald-300 hover:text-emerald-200 transition"
                                >
                                    {bottomRightLinkText}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
