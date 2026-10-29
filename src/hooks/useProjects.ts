import React from "react";
import {useLoaderData} from "react-router-dom";
import {useProjectsStore} from "@/stores/useProjectsStore";
import type {Project} from "@/types";

export type {ProjectsStatus} from "@/stores/useProjectsStore";

export function useProjects() {
    // Build 時預載嘅資料已經喺 HTML 入面，首次 render 即有內容，唔使等 fetch
    const prefetched = useLoaderData() as Project[] | null;
    const {projects, status, refresh} = useProjectsStore();

    React.useEffect(() => {
        refresh(prefetched !== null);
    }, []);

    // Store 未載入前用預載資料頂住
    if (status === "loading" && prefetched) {
        return {projects: prefetched, status: "success" as const};
    }
    return {projects, status};
}
