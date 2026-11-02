import {CATEGORIES} from "@/data/projects";
import {useProjects} from "@/hooks/useProjects";
import {useShowcaseStore} from "@/stores/useShowcaseStore";
import {useLightbox} from "@/hooks/useLightbox";
import {Lightbox} from "@/components/ui/Lightbox";
import {CircularProgress} from "@/components/ui/CircularProgress";
import {ProjectCard} from "./ProjectCard";

export const Showcase = () => {
    const {categoryId, switched, selectCategory} = useShowcaseStore();
    const lightbox = useLightbox();
    const {projects, status} = useProjects();

    const tabs = [{id: "all", name: "全部"}, ...CATEGORIES.filter(c => projects.some(p => p.categoryId === c.id))];
    const visible = categoryId === "all" ? projects : projects.filter(p => p.categoryId === categoryId);

    return (
        <section id="showcase" className="scroll-mt-16 bg-white pt-16">
            <div>
                <div className="reveal mx-auto mb-12 flex max-w-6xl flex-col gap-8 px-6 md:px-12 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-5 flex items-center gap-3 text-xs tracking-[0.4em] text-accent uppercase">
                            <span aria-hidden="true" className="h-px w-10 bg-accent" />
                            Our Projects
                        </p>
                        <h2 className="text-5xl leading-[1.1] font-light whitespace-nowrap text-brand md:text-6xl">作品展示</h2>
                        <p className="mt-5 text-lg text-brand-light">歡迎瀏覽我們完成的項目</p>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                aria-pressed={categoryId === tab.id}
                                onClick={() => selectCategory(tab.id)}
                                className={`min-h-11 border-b-2 text-lg transition-colors ${categoryId === tab.id ? "border-accent font-semibold text-brand" : "border-transparent text-brand-light hover:text-accent"}`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
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
