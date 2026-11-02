type SectionHeadingProps = {
    id: string;
    eyebrow: string;
    title: string;
};

export const SectionHeading = (props: SectionHeadingProps) => {
    return (
        <div className="mb-8">
            <p className="mb-3 flex items-center gap-3 text-xs tracking-[0.4em] text-accent uppercase">
                <span aria-hidden="true" className="h-px w-10 bg-accent" />
                {props.eyebrow}
            </p>
            <h2 id={props.id} className="text-3xl font-light text-brand md:text-4xl">
                {props.title}
            </h2>
        </div>
    );
};
