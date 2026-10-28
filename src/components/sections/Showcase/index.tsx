import React from "react";
import {CATEGORIES} from "@/data/projects";
import {useProjects} from "@/hooks/useProjects";
import {useLightbox} from "@/hooks/useLightbox";
import {Lightbox} from "@/components/ui/Lightbox";
import {CircularProgress} from "@/components/ui/CircularProgress";
import {SectionTitle} from "@/components/ui/SectionTitle";
import {ProjectCard} from "./ProjectCard";

export const Showcase = () => {
    const [categoryId, setCategoryId] = React.useState("all");
    const [switched, setSwitched] = React.useState(false);
    const lightbox = useLightbox();
    const {projects, status} = useProjects();

    const tabs = [{id: "all", name: "全部"}, ...CATEGORIES.filter(c => projects.some(p => p.categoryId === c.id))];
    const visible = categoryId === "all" ? projects : projects.filter(p => p.categoryId === categoryId);

    return (
        <section id="showcase" className="scroll-mt-16 bg-white pt-16">
            <div>
                <div className="px-4">
                    <SectionTitle eyebrow="Our Projects" title="作品展示" subtitle="歡迎瀏覽我們完成的項目" />
                </div>

                <div className="mb-8 flex flex-wrap justify-center gap-2 px-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            aria-pressed={categoryId === tab.id}
                            onClick={() => {
                                setCategoryId(tab.id);
                                setSwitched(true);
                            }}
                            className={`min-h-11 rounded-full px-5 font-semibold transition ${categoryId === tab.id ? "bg-accent text-white shadow-md shadow-accent/30" : "bg-surface text-brand hover:-translate-y-0.5 hover:bg-accent/20"}`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                {status === "loading" && <CircularProgress />}
                {status === "error" && <p className="px-4 py-16 text-center text-brand-light">暫時未能載入作品，請稍後再試。</p>}

                <div key={categoryId} className={`stagger grid md:grid-cols-2 lg:grid-cols-3 ${switched ? "tab-swap" : ""}`}>
                    {visible.map(project => (
                        <ProjectCard key={project.id} project={project} categoryName={CATEGORIES.find(c => c.id === project.categoryId)?.name ?? ""} onOpen={lightbox.open} />
                    ))}
                </div>
            </div>

            {lightbox.project && <Lightbox project={lightbox.project} index={lightbox.index} direction={lightbox.direction} onClose={lightbox.close} onNext={lightbox.next} onPrev={lightbox.prev} />}
        </section>
    );
};
