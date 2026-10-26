import {CATEGORIES} from "@/data/projects";
import type {ClientProject} from "@/types/progress";

const STATUS_LABEL = {lead: "籌備中", active: "施工中"} as const;

export const ProjectSummary = (props: {project: ClientProject}) => {
    const {project} = props;
    const total = project.milestones.length;
    const done = project.milestones.filter(m => m.status === "done").length;
    const categoryName = CATEGORIES.find(c => c.id === project.category)?.name;

    const links = [{id: "progress-milestones", label: "進度"}, ...(project.photos.length > 0 ? [{id: "progress-photos", label: "相片"}] : []), {id: "progress-comments", label: "留言"}];

    return (
        <section aria-labelledby="project-title" className="mb-8">
            {project.cover_photo && <img src={project.cover_photo.url} alt={`${project.title} 封面`} width={1200} height={900} className="mb-4 aspect-4/3 w-full rounded-lg object-cover" />}
            <h1 id="project-title" className="mb-2 text-2xl font-bold wrap-break-word">
                {project.title}
            </h1>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-accent px-3 py-0.5 font-semibold text-white">{STATUS_LABEL[project.status]}</span>
                {project.district && <span className="text-brand-light">{project.district}</span>}
                {categoryName && <span className="rounded bg-white px-2 py-0.5 text-brand-light">{categoryName}</span>}
            </div>
            {total > 0 && (
                <p className="mb-4 text-sm text-brand-light">
                    已完成 {done} / {total} 項
                </p>
            )}
            <nav aria-label="頁內導航" className="flex gap-2 border-t border-brand/10 pt-3">
                {links.map(link => (
                    <a key={link.id} href={`#${link.id}`} className="flex min-h-11 items-center rounded-full bg-white px-5 font-semibold hover:bg-accent/20">
                        {link.label}
                    </a>
                ))}
            </nav>
        </section>
    );
};
