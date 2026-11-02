import React from "react";
import {LuArrowDown} from "react-icons/lu";
import HeroImage from "@/assets/hero.webp";
import {useHeroCarousel} from "@/hooks/useHeroCarousel";
import {useProjects} from "@/hooks/useProjects";
import {HeroControls} from "./HeroControls";
import {HeroTabs} from "./HeroTabs";
import {HeroSlide, type Slide} from "./HeroSlide";

const FALLBACK_SLIDE: Slide = {id: "fallback", src: HeroImage, alt: "", title: "", district: null};

export const Hero = () => {
    const {projects} = useProjects();

    const slides: Slide[] = projects.flatMap(project => {
        const cover = project.cover || project.images[0];
        return cover ? [{id: project.id, src: cover.src, alt: cover.alt, title: project.name, district: project.district}] : [];
    });
    const list = slides.length > 0 ? slides : [FALLBACK_SLIDE];
    const count = list.length;

    const carousel = useHeroCarousel(count);
    const {current} = carousel;
    const slide = list[current];

    const isNear = (i: number) => i === current || i === (current + 1) % count || i === (current - 1 + count) % count;

    return (
        <section
            id="home"
            aria-roledescription="carousel"
            aria-label="精選作品"
            onPointerEnter={e => e.pointerType === "mouse" && carousel.setPaused(true)}
            onPointerLeave={e => e.pointerType === "mouse" && carousel.setPaused(false)}
            onFocus={() => carousel.setPaused(true)}
            onBlur={() => carousel.setPaused(false)}
            {...carousel.swipeHandlers}
            className="relative flex min-h-[85svh] touch-pan-y scroll-mt-16 flex-col justify-end overflow-clip bg-brand text-white"
        >
            {list.map((item, i) => (
                <HeroSlide key={item.id} slide={item} position={i} count={count} active={i === current} near={isNear(i)} />
            ))}

            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand/95 via-brand/30 to-brand/30" />

            <div className="hero-exit relative px-4 pt-32 pb-6 md:px-16 md:pb-10">
                <div aria-live={carousel.paused ? "polite" : "off"}>
                    <div key={slide.id} className="animate-hero-rise motion-reduce:animate-none">
                        {slide.district && (
                            <p className="mb-4 flex items-center gap-2 text-sm tracking-[0.3em] text-white/90 md:text-lg">
                                <span aria-hidden="true" className="h-px w-10 origin-left animate-hero-line bg-accent motion-reduce:animate-none" />
                                {slide.district}
                            </p>
                        )}
                        <h2 className="max-w-5xl text-5xl leading-[1.1] font-light text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] md:text-7xl lg:text-8xl">{slide.title}</h2>
                    </div>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                    <a href="#showcase" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-accent px-8 font-semibold text-white transition-colors hover:bg-accent-dark">
                        瀏覽作品
                        <LuArrowDown aria-hidden="true" className="h-4 w-4" />
                    </a>
                    {count > 1 && <HeroControls current={current} count={count} onGoTo={carousel.goTo} />}
                </div>

                {count > 1 && <HeroTabs slides={list} current={current} paused={carousel.paused} onGoTo={carousel.goTo} />}
            </div>
        </section>
    );
};
