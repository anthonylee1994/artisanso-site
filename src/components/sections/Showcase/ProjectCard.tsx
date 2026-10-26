import React from "react";
import {LuZoomIn} from "react-icons/lu";
import type {Project} from "@/types";

type ProjectCardProps = {
    project: Project;
    categoryName: string;
    onOpen: (project: Project, trigger: HTMLElement) => void;
};

export const ProjectCard = React.memo((props: ProjectCardProps) => {
    const {project} = props;
    const cover = project.cover || project.images[0];

    return (
        <button
            type="button"
            onClick={e => props.onOpen(project, e.currentTarget)}
            className="reveal group relative overflow-hidden rounded-lg bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
        >
            <div className="relative aspect-3/2 overflow-hidden">
                <img src={cover.src} alt={cover.alt} width={1200} height={800} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-brand/80 via-brand/30 to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="flex translate-y-3 items-center gap-2 rounded-full border border-accent bg-brand/60 px-4 py-2 text-sm text-white transition duration-300 group-hover:translate-y-0">
                        <LuZoomIn className="h-4 w-4 text-accent" aria-hidden="true" />
                        查看相集
                    </span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold">{project.name}</h3>
                <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="rounded bg-surface px-2 py-0.5 text-brand-light">{props.categoryName}</span>
                    <span className="text-brand-light">{project.images.length} 張</span>
                </div>
            </div>
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
        </button>
    );
});
