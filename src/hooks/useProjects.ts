import React from "react";
import {API_ORIGIN} from "@/constants/api";
import type {Project} from "@/types";

const API_URL = `${API_ORIGIN}/api/v1/projects`;

type ApiPhoto = {id: string; url: string; position: number};

type ApiProject = {
    id: string;
    title: string;
    category: string;
    position: number;
    cover_photo: {id: string; url: string} | null;
    photos: ApiPhoto[];
};

let cache: Promise<Project[]> | null = null;

function toProject(item: ApiProject): Project {
    const photos = [...item.photos].sort((a, b) => a.position - b.position);
    return {
        id: item.id,
        categoryId: item.category,
        name: item.title,
        cover: item.cover_photo ? {src: item.cover_photo.url, alt: `${item.title} 裝修工程封面`} : null,
        images: photos.map((photo, index) => ({src: photo.url, alt: `${item.title} 裝修工程相片 ${index + 1}`})),
    };
}

function loadProjects() {
    if (!cache) {
        cache = fetch(API_URL)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch projects: ${res.status}`);
                }
                return res.json() as Promise<{data: ApiProject[]}>;
            })
            .then(json =>
                [...json.data]
                    .sort((a, b) => a.position - b.position)
                    .map(toProject)
                    .filter(project => project.images.length > 0)
            )
            .catch(error => {
                cache = null;
                throw error;
            });
    }
    return cache;
}

export type ProjectsStatus = "loading" | "success" | "error";

export function useProjects() {
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [status, setStatus] = React.useState<ProjectsStatus>("loading");

    React.useEffect(() => {
        let cancelled = false;
        setStatus("loading");
        loadProjects()
            .then(data => {
                if (!cancelled) {
                    setProjects(data);
                    setStatus("success");
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setStatus("error");
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return {projects, status};
}
