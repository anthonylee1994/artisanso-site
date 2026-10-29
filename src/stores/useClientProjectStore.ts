import {create} from "zustand";
import {clientGet, toApiError} from "@/api/clientApi";
import type {ApiError, ClientProject} from "@/types/progress";

interface ClientProjectState {
    project: ClientProject | null;
    error: ApiError | null;
    load: (code: string, onUnauthorized: () => void) => Promise<void>;
    cancel: () => void;
    clear: () => void;
}

let controller: AbortController | null = null;

function normalize(project: ClientProject): ClientProject {
    return {
        ...project,
        milestones: [...(project.milestones ?? [])].sort((a, b) => a.position - b.position),
        photos: [...(project.photos ?? [])].sort((a, b) => a.position - b.position),
    };
}

export const useClientProjectStore = create<ClientProjectState>(set => ({
    project: null,
    error: null,
    // 新 request 會取消上一個仍未完成嘅 request
    load: async (code, onUnauthorized) => {
        controller?.abort();
        const current = new AbortController();
        controller = current;
        try {
            const res = await clientGet<ClientProject>("/project", code, current.signal);
            set({project: normalize(res.data), error: null});
        } catch (e) {
            if (current.signal.aborted) return;
            const apiError = toApiError(e);
            if (apiError.status === 401) {
                set({project: null, error: null});
                onUnauthorized();
            } else {
                set({error: apiError});
            }
        }
    },
    cancel: () => controller?.abort(),
    clear: () => {
        controller?.abort();
        set({project: null, error: null});
    },
}));
