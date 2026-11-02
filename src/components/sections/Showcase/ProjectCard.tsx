import React from "react";
import type {Project} from "@/types";
import {LuMapPin} from "react-icons/lu";

type ProjectCardProps = {
    project: Project;
    categoryName: string;
    onOpen: (project: Project, trigger: HTMLElement) => void;
};

export const ProjectCard = React.memo((props: ProjectCardProps) => {
    const {project} = props;
    const cover = project.cover || project.images[0];

    return (
        <button type="button" onClick={e => props.onOpen(project, e.currentTarget)} className="reveal group relative aspect-square overflow-hidden bg-brand text-left">
            <img src={cover.src} alt={cover.alt} width={1200} height={1200} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand/85 via-brand/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 text-white">
                <span aria-hidden="true" className="h-px w-8 bg-accent transition-[width] duration-500 group-hover:w-16" />
                {props.categoryName && <p className="text-xs tracking-[0.3em] text-accent">{props.categoryName}</p>}
                <h3 className="text-2xl font-light">{project.name}</h3>
                {project.district && (
                    <p className="flex items-center text-sm text-white/80">
                        <LuMapPin aria-hidden="true" className="mr-1 h-4 w-4" />
                        {project.district}
                    </p>
                )}
            </div>
        </button>
    );
});
