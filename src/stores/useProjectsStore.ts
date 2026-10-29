import {create} from "zustand";
import {fetchProjects} from "@/api/projectsApi";
import type {Project} from "@/types";

export type ProjectsStatus = "loading" | "success" | "error";

interface ProjectsState {
    projects: Project[];
    status: ProjectsStatus;
    refresh: (hasPrefetched: boolean) => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
    projects: [],
    status: "loading",
    refresh: async hasPrefetched => {
        try {
            const data = await fetchProjects();
            // 有預載資料時靜默更新，只有內容真係變咗先重新 render
            const unchanged = JSON.stringify(get().projects) === JSON.stringify(data);
            set(unchanged ? {status: "success"} : {projects: data, status: "success"});
        } catch {
            if (!hasPrefetched) set({status: "error"});
        }
    },
}));
