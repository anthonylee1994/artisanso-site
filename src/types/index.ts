export type ProjectCategory = {
    id: string;
    name: string;
};

export type ProjectImage = {
    src: string;
    alt: string;
};

export type Project = {
    id: string;
    categoryId: string;
    name: string;
    images: ProjectImage[];
};

export const UNIT_TYPES = ["私樓", "居屋", "公屋", "村屋", "洋房", "辦公室 / 寫字樓", "零售店舖", "餐飲 / 商業單位", "其他"] as const;
export type UnitType = (typeof UNIT_TYPES)[number];

export type QuoteFormValues = {
    name: string;
    unitType: UnitType;
    area: number;
    district: string;
    requirement: string;
};

export type QuoteFormDraft = {
    name: string;
    unitType: string;
    area: string;
    district: string;
    requirement: string;
};

export type QuoteFormErrors = Partial<Record<keyof QuoteFormDraft, string>>;
