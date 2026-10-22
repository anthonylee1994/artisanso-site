import React from "react";
import type {Project} from "../types";

export type SlideDirection = "next" | "prev";

export function useLightbox() {
    const [project, setProject] = React.useState<Project | null>(null);
    const [index, setIndex] = React.useState(0);
    const [direction, setDirection] = React.useState<SlideDirection | null>(null);
    const triggerRef = React.useRef<HTMLElement | null>(null);

    const open = (target: Project, trigger: HTMLElement | null) => {
        triggerRef.current = trigger;
        setProject(target);
        setIndex(0);
        setDirection(null);
    };

    const close = () => setProject(null);

    const next = () => {
        if (!project) return;
        setDirection("next");
        setIndex(i => (i + 1) % project.images.length);
    };

    const prev = () => {
        if (!project) return;
        setDirection("prev");
        setIndex(i => (i - 1 + project.images.length) % project.images.length);
    };

    const isOpen = project !== null;

    // 鎖 body scroll、關閉後 focus 返去觸發嘅 Card
    React.useEffect(() => {
        if (!isOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const trigger = triggerRef.current;
        return () => {
            document.body.style.overflow = original;
            trigger?.focus();
        };
    }, [isOpen]);

    // 鍵盤：← → Esc
    React.useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            else if (e.key === "ArrowRight") next();
            else if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    });

    return {project, index, direction, isOpen, open, close, next, prev};
}
