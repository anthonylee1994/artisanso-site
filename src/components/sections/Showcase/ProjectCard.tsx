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
            <img src={cover.src} alt={cover.alt} width={1200} height={1200} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-brand/75 px-6 text-center text-white opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:items-end [@media(hover:none)]:justify-end [@media(hover:none)]:bg-transparent [@media(hover:none)]:bg-linear-to-t [@media(hover:none)]:from-brand/80 [@media(hover:none)]:via-transparent [@media(hover:none)]:to-transparent [@media(hover:none)]:pb-6 [@media(hover:none)]:opacity-100">
                <h3 className="text-xl font-medium">{project.name}</h3>
                <p className="flex items-center text-sm text-white/70">
                    <LuMapPin aria-hidden="true" className="mr-1 h-4 w-4" />
                    {project.district}
                </p>
                <p className="text-sm tracking-widest text-white/70">[ {props.categoryName} ]</p>
            </div>
        </button>
    );
});
