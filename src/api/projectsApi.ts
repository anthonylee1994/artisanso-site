import {API_ORIGIN} from "@/constants/api";
import type {Project} from "@/types";

const API_URL = `${API_ORIGIN}/api/v1/projects`;

type ApiPhoto = {id: string; url: string; position: number};

type ApiProject = {
    id: string;
    title: string;
    category: string;
    district: string | null;
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
        district: item.district || null,
        cover: item.cover_photo ? {src: item.cover_photo.url, alt: `${item.title} 裝修工程封面`} : null,
        images: photos.map((photo, index) => ({src: photo.url, alt: `${item.title} 裝修工程相片 ${index + 1}`})),
    };
}

// 瀏覽器端共用同一個 request，失敗時清走 cache 方便重試
export function fetchProjects() {
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

// Build 時（SSG）預先攞作品資料寫入 HTML；API 失敗就回傳 null，由瀏覽器端補載入
export async function projectsLoader() {
    try {
        return await fetchProjects();
    } catch (error) {
        console.warn("[projectsLoader] Failed to prefetch projects, falling back to client fetch", error);
        return null;
    }
}
