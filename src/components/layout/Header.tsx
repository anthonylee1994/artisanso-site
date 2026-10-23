import React from "react";
import {useActiveSection} from "@/hooks/useActiveSection";

const NAV_ITEMS = [
    {id: "top", label: "首頁"},
    {id: "about", label: "關於我們"},
    {id: "showcase", label: "作品展示"},
    {id: "quote", label: "即時報價"},
    {id: "contact", label: "聯絡我們"},
];

export const Header = () => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const active = useActiveSection(NAV_ITEMS.map(i => i.id));

    return (
        <header className="sticky top-0 z-30 bg-brand text-white shadow">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <a href="#top" className="flex min-h-11 items-center gap-2 text-lg font-bold">
                    <img src="/logo.svg" alt="" width={32} height={32} />
                    匠方工程
                </a>

                <nav aria-label="主選單" className="hidden gap-6 md:flex">
                    {NAV_ITEMS.map(item => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className={`flex min-h-11 items-center border-b-2 transition ${active === item.id ? "border-accent text-accent" : "border-transparent hover:text-accent"}`}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <a href="#quote" className="flex min-h-11 items-center rounded bg-accent px-4 font-semibold transition hover:bg-accent-dark">
                        即時報價
                    </a>
                    <button
                        type="button"
                        aria-label="開關選單"
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex h-11 w-11 items-center justify-center md:hidden"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path
                                d="M4 7h16"
                                className={`origin-center transition-[translate,rotate] duration-300 ease-out transform-fill motion-reduce:transition-none ${menuOpen ? "translate-y-1.25 rotate-45" : ""}`}
                            />
                            <path d="M4 12h16" className={`origin-center transition-opacity duration-200 motion-reduce:transition-none ${menuOpen ? "opacity-0" : ""}`} />
                            <path
                                d="M4 17h16"
                                className={`origin-center transition-[translate,rotate] duration-300 ease-out transform-fill motion-reduce:transition-none ${menuOpen ? "-translate-y-1.25 -rotate-45" : ""}`}
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <nav
                id="mobile-menu"
                aria-label="手機選單"
                inert={!menuOpen}
                className={`grid bg-brand-light transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none md:hidden ${menuOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"}`}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-white/10 py-2">
                        {NAV_ITEMS.map(item => (
                            <a key={item.id} href={`#${item.id}`} onClick={() => setMenuOpen(false)} className={`flex min-h-12 items-center px-6 ${active === item.id ? "text-accent" : ""}`}>
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
};
