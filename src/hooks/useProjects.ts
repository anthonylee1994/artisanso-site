import React from "react";
import {useLoaderData} from "react-router-dom";
import {fetchProjects} from "@/api/projectsApi";
import type {Project} from "@/types";

export type ProjectsStatus = "loading" | "success" | "error";

export function useProjects() {
    // Build 時預載嘅資料已經喺 HTML 入面，首次 render 即有內容，唔使等 fetch
    const prefetched = useLoaderData() as Project[] | null;
    const [projects, setProjects] = React.useState<Project[]>(prefetched ?? []);
    const [status, setStatus] = React.useState<ProjectsStatus>(prefetched ? "success" : "loading");

    React.useEffect(() => {
        let cancelled = false;
        // 有預載資料時靜默更新，只有內容真係變咗先重新 render
        fetchProjects()
            .then(data => {
                if (cancelled) return;
                setProjects(prev => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
                setStatus("success");
            })
            .catch(() => {
                if (!cancelled && !prefetched) {
                    setStatus("error");
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return {projects, status};
}
