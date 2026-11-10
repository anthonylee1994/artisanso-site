import type {ClientSection} from "@/types/progress";

// 分類按 position 排序，分類內細項亦然
export function sortSections(sections: ClientSection[] | undefined): ClientSection[] {
    return [...(sections ?? [])].sort((a, b) => a.position - b.position).map(section => ({...section, line_items: [...section.line_items].sort((a, b) => a.position - b.position)}));
}

// 冇細項嘅文件 PDF 冇內容
export function hasLineItems(sections: ClientSection[]): boolean {
    return sections.some(section => section.line_items.length > 0);
}
