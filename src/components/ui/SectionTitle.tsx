import React from "react";

type SectionTitleProps = {
    title: string;
    subtitle?: string;
    light?: boolean;
};

export const SectionTitle = (props: SectionTitleProps) => {
    return (
        <div className="mb-10 text-center">
            <h2 className={`text-2xl font-bold md:text-3xl ${props.light ? "text-white" : "text-brand"}`}>{props.title}</h2>
            <div className="mx-auto mt-3 h-1 w-12 rounded bg-accent" />
            {props.subtitle && <p className={`mt-4 ${props.light ? "text-white/80" : "text-brand-light"}`}>{props.subtitle}</p>}
        </div>
    );
};
