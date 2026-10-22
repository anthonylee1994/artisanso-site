import React from "react";
import {PROJECTS} from "../../data/projects";

export const Hero = () => {
    const bg = PROJECTS[0]?.images[0];

    return (
        <section id="top" className="relative flex min-h-[80vh] scroll-mt-16 items-center justify-center overflow-hidden text-center text-white">
            {bg && <img src={bg.src} alt="" width={1200} height={800} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />}
            <div className="absolute inset-0 bg-brand/75" />
            <div className="relative px-4 py-20">
                <h1 className="text-4xl font-bold tracking-widest md:text-6xl">匠方工程</h1>
                <p className="mt-4 text-lg md:text-2xl">用心施工，每個細節皆見匠心</p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <a href="#showcase" className="flex min-h-12 min-w-40 items-center justify-center rounded border border-white px-6 font-semibold transition hover:bg-white hover:text-brand">
                        查看我們的作品
                    </a>
                    <a href="#quote" className="flex min-h-12 min-w-40 items-center justify-center rounded bg-accent px-6 font-semibold transition hover:bg-accent-dark">
                        即時報價
                    </a>
                </div>
            </div>
        </section>
    );
};
