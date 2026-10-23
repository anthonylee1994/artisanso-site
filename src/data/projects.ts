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
        .map(([, src], index) => ({src, alt: `${name} 相片 ${index + 1}`}));
}

export const CATEGORIES: ProjectCategory[] = [
    {id: "home", name: "住宅翻新"},
    {id: "office", name: "商舖及辦公室"},
    {id: "dining", name: "餐飲空間"},
    {id: "village", name: "村屋及洋房"},
];

const RAW: Omit<Project, "images">[] = [
    {id: "元朗朗桃閣", categoryId: "home", name: "元朗朗桃閣"},
    {id: "堅尼地城加多近山", categoryId: "home", name: "堅尼地城加多近山"},
    {id: "美乎曼克頓山", categoryId: "home", name: "美乎曼克頓山"},
    // {id: "home-reno-1", categoryId: "home", name: "大埔私樓全屋翻新"},
    // {id: "home-reno-2", categoryId: "home", name: "荃灣居屋廚廁更新"},
    // {id: "shop-office-1", categoryId: "office", name: "元朗寫字樓裝修"},
    // {id: "restaurant-1", categoryId: "dining", name: "荃灣餐廳工程"},
    // {id: "village-house-1", categoryId: "village", name: "元朗村屋翻新"},
    // {id: "village-house-2", categoryId: "village", name: "大埔洋房內外裝修"},
];

export const PROJECTS: Project[] = RAW.map(p => ({
    ...p,
    images: imagesOf(p.id, p.name),
}));
