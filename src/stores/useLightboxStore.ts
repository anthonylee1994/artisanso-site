import {create} from "zustand";
import type {Project} from "@/types";

export type SlideDirection = "next" | "prev";

interface LightboxState {
    project: Project | null;
    index: number;
    direction: SlideDirection | null;
    trigger: HTMLElement | null;
    open: (target: Project, trigger: HTMLElement | null, startIndex?: number) => void;
    close: () => void;
    next: () => void;
    prev: () => void;
}

export const useLightboxStore = create<LightboxState>((set, get) => ({
    project: null,
    index: 0,
    direction: null,
    trigger: null,
    open: (target, trigger, startIndex = 0) => set({project: target, trigger, index: startIndex, direction: null}),
    close: () => set({project: null}),
    next: () => {
        const {project, index} = get();
        if (!project) return;
        set({direction: "next", index: (index + 1) % project.images.length});
    },
    prev: () => {
        const {project, index} = get();
        if (!project) return;
        set({direction: "prev", index: (index - 1 + project.images.length) % project.images.length});
    },
}));
