import React from "react";

export type Slide = {
    id: string;
    src: string;
    alt: string;
    title: string;
    district: string | null;
};

type HeroSlideProps = {
    slide: Slide;
    position: number;
    count: number;
    active: boolean;
    // 只有當前同相鄰 slide 先會載入圖片
    near: boolean;
};

export const HeroSlide = React.memo((props: HeroSlideProps) => {
    const {slide, active} = props;
    const first = props.position === 0;

    return (
        <div
            role="group"
            aria-roledescription="slide"
            aria-label={`${props.position + 1} / ${props.count}`}
            aria-hidden={!active}
            inert={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ${active ? "opacity-100" : "opacity-0"}`}
        >
            {props.near && (
                <img
                    src={slide.src}
                    alt={slide.alt}
                    width={1200}
                    height={800}
                    fetchPriority={first ? "high" : "auto"}
                    loading={first ? "eager" : "lazy"}
                    className={`h-full w-full object-cover ${active ? "animate-hero-drift motion-reduce:animate-none" : ""}`}
                />
            )}
        </div>
    );
});
