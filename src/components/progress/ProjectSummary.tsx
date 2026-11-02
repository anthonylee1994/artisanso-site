import {CATEGORIES} from "@/data/projects";
import type {ClientProject} from "@/types/progress";

const STATUS_LABEL = {lead: "籌備中", active: "施工中"} as const;

export const ProjectSummary = (props: {project: ClientProject}) => {
    const {project} = props;
    const total = project.milestones.length;
    const done = project.milestones.filter(m => m.status === "done").length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    const categoryName = CATEGORIES.find(c => c.id === project.category)?.name;

    return (
        <section aria-labelledby="project-title" className="mb-12">
            <div className="relative flex min-h-72 items-end overflow-clip rounded-lg bg-brand text-white md:min-h-96">
                {project.cover_photo && <img src={project.cover_photo.url} alt={`${project.title} 封面`} width={1200} height={900} className="absolute inset-0 h-full w-full object-cover" />}
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-brand/90 via-brand/30 to-brand/10" />
                <div className="relative w-full p-6 md:p-10">
                    <p className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <span className="rounded-md bg-accent px-3 py-1 font-semibold text-white">{STATUS_LABEL[project.status]}</span>
                        {project.district && <span className="tracking-widest text-white/90">{project.district}</span>}
                        {categoryName && <span className="text-white/70">{categoryName}</span>}
                    </p>
                    <h1 id="project-title" className="text-4xl leading-[1.1] font-light wrap-break-word md:text-6xl">
                        {project.title}
                    </h1>
                </div>
            </div>

            {total > 0 && (
                <div className="mt-8 flex items-center gap-6">
                    <p className="flex items-baseline gap-1 text-accent">
                        <span className="text-5xl font-light tabular-nums md:text-6xl">{percent}</span>
                        <span className="text-xl">%</span>
                    </p>
                    <div className="flex-1">
                        <div role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} aria-label="工程完成進度" className="h-1.5 overflow-hidden rounded-full bg-brand/15">
                            <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{width: `${percent}%`}} />
                        </div>
                        <p className="mt-2 text-sm text-brand-light">
                            已完成 {done} / {total} 項
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};
