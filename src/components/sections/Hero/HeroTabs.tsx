import React from "react";
import {AUTOPLAY_MS} from "@/hooks/useHeroCarousel";
import type {Slide} from "./HeroSlide";

type HeroTabsProps = {
    slides: Slide[];
    current: number;
    paused: boolean;
    onGoTo: (target: number) => void;
};

function pad(n: number) {
    return String(n).padStart(2, "0");
}

export const HeroTabs = (props: HeroTabsProps) => {
    const {slides, current} = props;
    const listRef = React.useRef<HTMLOListElement>(null);

    // 只捲動清單本身，唔好用 scrollIntoView，否則會連成個頁面一齊捲
    React.useEffect(() => {
        const list = listRef.current;
        const item = list?.querySelector<HTMLElement>("[aria-current='true']");
        if (!list || !item) return;
        list.scrollTo({left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior: "smooth"});
    }, [current]);

    return (
        <nav aria-label="作品列表" className="mt-10">
            <ol ref={listRef} className="relative flex gap-2 overflow-x-auto overscroll-contain md:gap-6">
                {slides.map((slide, i) => {
                    const active = i === current;
                    return (
                        <li key={slide.id} className="min-w-0 flex-1 md:min-w-44">
                            <button type="button" aria-label={`${pad(i + 1)} ${slide.title}`} aria-current={active} onClick={() => props.onGoTo(i)} className="group block w-full text-left">
                                <span className="relative block h-0.5 w-full overflow-hidden bg-white/25 transition-colors group-hover:bg-white/50">
                                    {active && (
                                        <span
                                            key={slide.id}
                                            aria-hidden="true"
                                            className="absolute inset-0 origin-left animate-hero-progress bg-accent motion-reduce:animate-none"
                                            style={{animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: props.paused ? "paused" : "running"}}
                                        />
                                    )}
                                </span>
                                <span className={`mt-3 hidden items-baseline gap-3 transition-colors md:flex ${active ? "text-white" : "text-white/50 group-hover:text-white/80"}`}>
                                    <span className={`text-sm tabular-nums ${active ? "text-accent" : ""}`}>{pad(i + 1)}</span>
                                    <span className="truncate">{slide.title}</span>
                                </span>
                                <span className="block h-4 md:hidden" />
                            </button>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
