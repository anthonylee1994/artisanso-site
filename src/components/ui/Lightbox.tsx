import React from "react";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import type {Project} from "../../types";

type LightboxProps = {
    project: Project;
    index: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
};

const SWIPE_THRESHOLD = 50;

export const Lightbox = (props: LightboxProps) => {
    const {project, index} = props;
    const image = project.images[index];
    const dialogRef = React.useRef<HTMLDivElement>(null);
    const touchStartX = React.useRef<number | null>(null);
    const multiple = project.images.length > 1;

    // 開啟時 focus 入 dialog
    React.useEffect(() => {
        dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, []);

    // Focus trap
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key !== "Tab") return;
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (delta > SWIPE_THRESHOLD) props.onPrev();
        else if (delta < -SWIPE_THRESHOLD) props.onNext();
    };

    const arrowClass = "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-3xl text-white hover:bg-black/70";

    return (
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={project.name}
            onKeyDown={onKeyDown}
            className="fixed inset-0 z-50 flex animate-lightbox-fade flex-col bg-black/90 motion-reduce:animate-none"
        >
            <div className="flex items-center justify-between px-4 py-3 text-white">
                <div>
                    <div className="font-bold">{project.name}</div>
                    <div className="text-sm text-white/70">
                        {index + 1} / {project.images.length}
                    </div>
                </div>
                <button type="button" aria-label="關閉" onClick={props.onClose} className="flex h-11 w-11 items-center justify-center text-3xl">
                    ×
                </button>
            </div>

            <div
                className="relative flex flex-1 items-center justify-center overflow-hidden px-2"
                onClick={e => {
                    if (e.target === e.currentTarget) props.onClose();
                }}
                onTouchStart={e => (touchStartX.current = e.touches[0].clientX)}
                onTouchEnd={onTouchEnd}
            >
                <img key={image.src} src={image.src} alt={image.alt} className="max-h-full max-w-full animate-lightbox-zoom object-contain motion-reduce:animate-none" />
                {multiple && (
                    <React.Fragment>
                        <button type="button" aria-label="上一張" onClick={props.onPrev} className={`${arrowClass} left-2`}>
                            <FiChevronLeft aria-hidden="true" />
                        </button>
                        <button type="button" aria-label="下一張" onClick={props.onNext} className={`${arrowClass} right-2`}>
                            <FiChevronRight aria-hidden="true" />
                        </button>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};
