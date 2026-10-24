import type {Project, ProjectCategory} from "@/types";

const imageModules = import.meta.glob("@/assets/projects/*/*.{svg,jpg,jpeg,png,webp}", {
    eager: true,
    query: "?url",
    import: "default",
}) as Record<string, string>;

function imagesOf(projectId: string, name: string) {
    return Object.entries(imageModules)
        .filter(([path]) => path.includes(`/projects/${projectId}/`))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, src], index) => ({src, alt: `${name} 裝修工程相片 ${index + 1}`}));
}

export const CATEGORIES: ProjectCategory[] = [
    {id: "home", name: "住宅裝修"},
    {id: "office", name: "商舖及辦公室"},
    {id: "factory", name: "傢俬廠房"},
    // {id: "village", name: "村屋及洋房"},
];

const RAW: Omit<Project, "images">[] = [
    {id: "堅尼地城加多近山", categoryId: "home", name: "堅尼地城加多近山"},
    {id: "美孚曼克頓山", categoryId: "home", name: "美孚曼克頓山"},
    {id: "干德道帝豪閣", categoryId: "home", name: "干德道帝豪閣"},
    {id: "元朗朗桃閣", categoryId: "home", name: "元朗朗桃閣"},
    {id: "九龍灣合力工業大厦", categoryId: "office", name: "九龍灣合力工業大厦"},
    {id: "傢俬廠房", categoryId: "factory", name: "傢俬廠房"},
];

export const PROJECTS: Project[] = RAW.map(p => ({
    ...p,
    images: imagesOf(p.id, p.name),
}));
