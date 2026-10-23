import React from "react";
import type {Project} from "@/types";

type ProjectCardProps = {
    project: Project;
    categoryName: string;
    onOpen: (project: Project, trigger: HTMLElement) => void;
};

export const ProjectCard = React.memo((props: ProjectCardProps) => {
    const {project} = props;
    const cover = project.images[0];

    return (
        <button type="button" onClick={e => props.onOpen(project, e.currentTarget)} className="group overflow-hidden rounded-lg bg-white text-left shadow-sm transition hover:shadow-md">
            <div className="aspect-3/2 overflow-hidden">
                <img src={cover.src} alt={cover.alt} width={1200} height={800} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
            </div>
            <div className="p-4">
                <h3 className="font-bold">{project.name}</h3>
                <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="rounded bg-surface px-2 py-0.5 text-brand-light">{props.categoryName}</span>
                    <span className="text-brand-light">{project.images.length} 張</span>
                </div>
            </div>
        </button>
    );
});
