import React from "react";
import {CATEGORIES, PROJECTS} from "../../data/projects";
import {useLightbox} from "../../hooks/useLightbox";
import type {Project} from "../../types";
import {Lightbox} from "../ui/Lightbox";
import {SectionTitle} from "../ui/SectionTitle";

type ProjectCardProps = {
    project: Project;
    categoryName: string;
    onOpen: (project: Project, trigger: HTMLElement) => void;
};

const ProjectCard = React.memo((props: ProjectCardProps) => {
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

export const Showcase = () => {
    const [categoryId, setCategoryId] = React.useState("all");
    const lightbox = useLightbox();

    const tabs = [{id: "all", name: "全部"}, ...CATEGORIES];
    const visible = categoryId === "all" ? PROJECTS : PROJECTS.filter(p => p.categoryId === categoryId);

    return (
        <section id="showcase" className="scroll-mt-16 bg-white px-4 py-16">
            <div className="mx-auto max-w-6xl">
                <SectionTitle title="作品展示" subtitle="歡迎瀏覽我們完成的項目" />

                <div role="group" aria-label="作品分類" className="mb-8 flex flex-wrap justify-center gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            aria-pressed={categoryId === tab.id}
                            onClick={() => setCategoryId(tab.id)}
                            className={`min-h-11 rounded-full px-5 font-semibold transition ${categoryId === tab.id ? "bg-accent text-white" : "bg-surface text-brand hover:bg-accent/20"}`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {visible.map(project => (
                        <ProjectCard key={project.id} project={project} categoryName={CATEGORIES.find(c => c.id === project.categoryId)?.name ?? ""} onOpen={lightbox.open} />
                    ))}
                </div>
            </div>

            {lightbox.project && <Lightbox project={lightbox.project} index={lightbox.index} direction={lightbox.direction} onClose={lightbox.close} onNext={lightbox.next} onPrev={lightbox.prev} />}
        </section>
    );
};
