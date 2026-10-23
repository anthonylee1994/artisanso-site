type SectionTitleProps = {
    title: string;
    eyebrow?: string;
    subtitle?: string;
    light?: boolean;
};

export const SectionTitle = (props: SectionTitleProps) => {
    return (
        <div className="reveal mb-12 text-center">
            {props.eyebrow && <p className="mb-3 text-xs tracking-[0.4em] text-accent uppercase">{props.eyebrow}</p>}
            <h2 className={`text-2xl font-bold tracking-wide md:text-4xl ${props.light ? "text-white" : "text-brand"}`}>{props.title}</h2>
            <div aria-hidden="true" className="mt-5 flex items-center justify-center gap-3">
                <span className="h-px w-12 bg-linear-to-r from-transparent to-accent" />
                <span className="h-2 w-2 rotate-45 bg-accent" />
                <span className="h-px w-12 bg-linear-to-l from-transparent to-accent" />
            </div>
            {props.subtitle && <p className={`mt-5 ${props.light ? "text-white/80" : "text-brand-light"}`}>{props.subtitle}</p>}
        </div>
    );
};
