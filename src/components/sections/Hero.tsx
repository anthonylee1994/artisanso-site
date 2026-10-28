import React from "react";
import {LuChevronLeft, LuChevronRight, LuMapPin} from "react-icons/lu";
import HeroImage from "@/assets/hero.jpg";
import {useProjects} from "@/hooks/useProjects";
import {detectImageTone, type ImageTone} from "@/utils/imageTone";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;

type Slide = {
    id: string;
    src: string;
    alt: string;
    title: string;
    district: string | null;
};

const FALLBACK_SLIDE: Slide = {id: "fallback", src: HeroImage, alt: "", title: "", district: null};

export const Hero = () => {
    const {projects} = useProjects();
    const [index, setIndex] = React.useState(0);
    const [paused, setPaused] = React.useState(false);
    const [tones, setTones] = React.useState<Record<string, ImageTone>>({});
    const swipeStart = React.useRef<{x: number; y: number} | null>(null);

    const slides: Slide[] = projects.flatMap(project => {
        const cover = project.cover || project.images[0];
        return cover ? [{id: project.id, src: cover.src, alt: cover.alt, title: project.name, district: project.district}] : [];
    });
    const list = slides.length > 0 ? slides : [FALLBACK_SLIDE];
    const count = list.length;
    const current = index % count;

    const light = tones[list[current].id] === "light";

    const goTo = (target: number) => setIndex((target + count) % count);

    // 觸控 / 手寫筆橫向掃動換 slide，直向掃動仍然係捲動頁面（touch-pan-y）
    const onPointerDown = (e: React.PointerEvent) => {
        if (e.pointerType === "mouse") return;
        swipeStart.current = {x: e.clientX, y: e.clientY};
    };

    const onPointerUp = (e: React.PointerEvent) => {
        const start = swipeStart.current;
        swipeStart.current = null;
        if (!start || count < 2) return;
        const dx = e.clientX - start.x;
        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(e.clientY - start.y)) {
            goTo(dx > 0 ? current - 1 : current + 1);
        }
    };

    // 預先偵測所有 slide 嘅色調，避免切換到未載入嘅 slide 時先白字後突然變色
    const signature = list.map(slide => slide.id).join(",");
    React.useEffect(() => {
        let cancelled = false;
        slides.forEach(slide => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const tone = cancelled ? null : detectImageTone(img);
                if (tone) {
                    setTones(prev => (prev[slide.id] === tone ? prev : {...prev, [slide.id]: tone}));
                }
            };
            img.src = slide.src;
        });
        return () => {
            cancelled = true;
        };
    }, [signature]);

    React.useEffect(() => {
        if (paused || count < 2) return;
        const timer = window.setInterval(() => setIndex(i => (i + 1) % count), AUTOPLAY_MS);
        return () => window.clearInterval(timer);
    }, [paused, count, current]);

    return (
        <section
            id="home"
            aria-roledescription="carousel"
            aria-label="精選作品"
            onPointerEnter={e => e.pointerType === "mouse" && setPaused(true)}
            onPointerLeave={e => e.pointerType === "mouse" && setPaused(false)}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipeStart.current = null)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className={`relative flex min-h-[80vh] touch-pan-y scroll-mt-16 flex-col overflow-clip transition-colors duration-1000 ${light ? "text-brand" : "text-white"}`}
        >
            {list.map((slide, i) => {
                const active = i === current;
                return (
                    <div
                        key={slide.id}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} / ${count}`}
                        aria-hidden={!active}
                        inert={!active}
                        className={`absolute inset-0 transition-opacity duration-1000 ${active ? "opacity-100" : "opacity-0"}`}
                    >
                        <img
                            src={slide.src}
                            alt={slide.alt}
                            crossOrigin="anonymous"
                            width={1200}
                            height={800}
                            fetchPriority={i === 0 ? "high" : "auto"}
                            loading={i === 0 ? "eager" : "lazy"}
                            className={`h-full w-full object-cover ${active ? "animate-hero-drift motion-reduce:animate-none" : ""}`}
                        />
                    </div>
                );
            })}

            <div aria-hidden="true" className="pointer-events-none absolute inset-4 animate-hero-frame border border-accent/30 motion-reduce:animate-none md:inset-8">
                <span className="absolute -top-px -left-px h-6 w-6 border-t-2 border-l-2 border-accent" />
                <span className="absolute -top-px -right-px h-6 w-6 border-t-2 border-r-2 border-accent" />
                <span className="absolute -bottom-px -left-px h-6 w-6 border-b-2 border-l-2 border-accent" />
                <span className="absolute -right-px -bottom-px h-6 w-6 border-r-2 border-b-2 border-accent" />
            </div>

            <div className="hero-exit relative flex flex-1 flex-col px-4 pt-24 pb-16 text-center md:px-16">
                <div className="flex flex-1 items-center justify-center py-10" aria-live={paused ? "polite" : "off"}>
                    <div key={list[current].id} className="animate-hero-rise motion-reduce:animate-none">
                        {list[current].district && (
                            <p className="mb-3 flex items-center justify-center gap-1.5 text-sm tracking-widest transition-[font-size] duration-500 md:text-2xl">
                                <LuMapPin aria-hidden="true" className="h-4 w-4" />
                                {list[current].district}
                            </p>
                        )}
                        <h2 className="text-4xl font-thin transition-[font-size] duration-500 md:text-8xl">{list[current].title}</h2>
                    </div>
                </div>

                {count > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <div className="flex items-center">
                            {list.map((slide, i) => (
                                <button
                                    key={slide.id}
                                    type="button"
                                    aria-label={`第 ${i + 1} 張`}
                                    aria-current={i === current}
                                    onClick={() => goTo(i)}
                                    className="group flex h-11 w-6 items-center justify-center"
                                >
                                    <span
                                        className={`block h-1 rounded-full transition-[width,background-color] duration-1000 ${i === current ? "w-6 bg-accent" : light ? "w-3 bg-brand/40 group-hover:bg-brand" : "w-3 bg-white/50 group-hover:bg-white"}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {count > 1 && (
                <React.Fragment>
                    <button
                        type="button"
                        aria-label="上一張"
                        onClick={() => goTo(current - 1)}
                        className="group absolute top-1/2 left-0 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-brand/40 text-white transition-colors hover:bg-accent lg:h-20 lg:w-20"
                    >
                        <LuChevronLeft aria-hidden="true" className="h-6 w-6 lg:h-10 lg:w-10" />
                    </button>
                    <button
                        type="button"
                        aria-label="下一張"
                        onClick={() => goTo(current + 1)}
                        className="group absolute top-1/2 right-0 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-brand/40 text-white transition-colors hover:bg-accent lg:h-20 lg:w-20"
                    >
                        <LuChevronRight aria-hidden="true" className="h-6 w-6 lg:h-10 lg:w-10" />
                    </button>
                </React.Fragment>
            )}
        </section>
    );
};
