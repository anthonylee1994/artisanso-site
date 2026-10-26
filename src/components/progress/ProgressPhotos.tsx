import {Lightbox} from "@/components/ui/Lightbox";
import {useLightbox} from "@/hooks/useLightbox";
import type {Project} from "@/types";
import type {ClientProject} from "@/types/progress";

export const ProgressPhotos = (props: {project: ClientProject}) => {
    const lightbox = useLightbox();
    const {title, photos} = props.project;

    if (photos.length === 0) return null;

    const lightboxProject: Project = {
        id: props.project.slug,
        categoryId: "",
        name: title,
        cover: null,
        images: photos.map((photo, i) => ({src: photo.url, alt: `${title} 工程相片 ${i + 1}`})),
    };

    return (
        <section id="progress-photos" aria-labelledby="photos-title" className="mb-10 scroll-mt-20">
            <h2 id="photos-title" className="mb-4 text-xl font-bold">
                工程相片
            </h2>
            <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {photos.map((photo, i) => (
                    <li key={photo.id}>
                        <button
                            type="button"
                            aria-label={`放大工程相片 ${i + 1}`}
                            onClick={e => lightbox.open(lightboxProject, e.currentTarget, i)}
                            className="block w-full cursor-pointer overflow-hidden rounded"
                        >
                            <img src={photo.url} alt={`${title} 工程相片 ${i + 1}`} loading="lazy" width={400} height={300} className="aspect-4/3 w-full object-cover" />
                        </button>
                    </li>
                ))}
            </ul>
            {lightbox.project && <Lightbox project={lightbox.project} index={lightbox.index} direction={lightbox.direction} onClose={lightbox.close} onNext={lightbox.next} onPrev={lightbox.prev} />}
        </section>
    );
};
