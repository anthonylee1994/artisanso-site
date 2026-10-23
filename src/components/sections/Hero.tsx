import {PROJECTS} from "@/data/projects";

export const Hero = () => {
    const bg = PROJECTS[1]?.images[0];

    return (
        <section id="home" className="relative flex min-h-[80vh] scroll-mt-16 items-center justify-center overflow-clip text-center text-white">
            {bg && <img src={bg.src} alt="" width={1200} height={800} fetchPriority="high" className="absolute inset-0 h-full w-full animate-hero-drift object-cover motion-reduce:animate-none" />}
            <div className="absolute inset-0 bg-linear-to-b from-brand/85 via-brand/65 to-brand/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-brand)_130%)]" />

            <div aria-hidden="true" className="pointer-events-none absolute inset-4 animate-hero-frame border border-accent/30 motion-reduce:animate-none md:inset-8">
                <span className="absolute -top-px -left-px h-6 w-6 border-t-2 border-l-2 border-accent" />
                <span className="absolute -top-px -right-px h-6 w-6 border-t-2 border-r-2 border-accent" />
                <span className="absolute -bottom-px -left-px h-6 w-6 border-b-2 border-l-2 border-accent" />
                <span className="absolute -right-px -bottom-px h-6 w-6 border-r-2 border-b-2 border-accent" />
            </div>

            <div className="hero-exit relative px-4 py-20">
                <p className="animate-hero-rise text-xs tracking-[0.45em] text-accent uppercase motion-reduce:animate-none md:text-sm">Artisanso Engineering</p>
                <h1 className="mt-4 animate-hero-rise text-4xl font-bold tracking-widest [animation-delay:150ms] motion-reduce:animate-none md:text-6xl">匠方工程</h1>
                <div className="mx-auto mt-6 h-0.5 w-20 origin-center animate-hero-line bg-accent [animation-delay:450ms] motion-reduce:animate-none" />
                <p className="mt-6 animate-hero-rise text-lg [animation-delay:600ms] motion-reduce:animate-none md:text-2xl">用心施工，每個細節皆見匠心</p>
                <div className="mt-10 flex animate-hero-rise flex-col items-center justify-center gap-4 [animation-delay:800ms] motion-reduce:animate-none sm:flex-row">
                    <a
                        href="#showcase"
                        className="group flex min-h-12 min-w-40 items-center justify-center gap-2 rounded border border-white px-6 font-semibold transition hover:bg-white hover:text-brand"
                    >
                        查看我們的作品
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                            →
                        </span>
                    </a>
                    <a
                        href="#quote"
                        className="flex min-h-12 min-w-40 items-center justify-center rounded bg-accent px-6 font-semibold shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accent-dark"
                    >
                        即時報價
                    </a>
                </div>
            </div>

            <a href="#about" aria-label="向下捲動" className="absolute bottom-10 left-1/2 hidden h-12 w-6 -translate-x-1/2 items-start justify-center md:flex">
                <span className="relative block h-12 w-px overflow-hidden bg-white/20">
                    <span className="absolute inset-x-0 top-0 block h-1/2 animate-scroll-cue bg-accent motion-reduce:animate-none" />
                </span>
            </a>
        </section>
    );
};
