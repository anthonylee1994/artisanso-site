import React from "react";
import {clientGet, toApiError} from "@/api/clientApi";
import type {ApiError, ClientProject} from "@/types/progress";

type Handlers = {
    onVerified: (code: string) => void;
    onUnauthorized: () => void;
};

function normalize(project: ClientProject): ClientProject {
    return {
        ...project,
        milestones: [...(project.milestones ?? [])].sort((a, b) => a.position - b.position),
        photos: [...(project.photos ?? [])].sort((a, b) => a.position - b.position),
    };
}

export function useClientProject(code: string | null, handlers: Handlers) {
    const [project, setProject] = React.useState<ClientProject | null>(null);
    const [error, setError] = React.useState<ApiError | null>(null);
    const [nonce, setNonce] = React.useState(0);

    React.useEffect(() => {
        if (!code) {
            setProject(null);
            setError(null);
            return;
        }
        const controller = new AbortController();
        clientGet<ClientProject>("/project", code, controller.signal)
            .then(res => {
                setProject(normalize(res.data));
                setError(null);
                handlers.onVerified(code);
            })
            .catch(e => {
                if (controller.signal.aborted) return;
                const apiError = toApiError(e);
                if (apiError.status === 401) {
                    setProject(null);
                    setError(null);
                    handlers.onUnauthorized();
                } else {
                    setError(apiError);
                }
            });
        return () => controller.abort();
    }, [code, nonce]);

    const reload = () => setNonce(n => n + 1);

    return {project, error, reload};
}
