import {UNIT_TYPES, type QuoteFormDraft, type QuoteFormErrors, type QuoteFormValues, type UnitType} from "../types";

export const FIELD_ORDER = ["name", "unitType", "area", "district", "requirement"] as const;

export function validateQuote(draft: QuoteFormDraft): {
    values?: QuoteFormValues;
    errors: QuoteFormErrors;
} {
    const errors: QuoteFormErrors = {};

    const name = draft.name.trim();
    if (name.length < 1 || name.length > 30) {
        errors.name = "請輸入稱呼（1–30 字）";
    }

    if (!UNIT_TYPES.includes(draft.unitType as UnitType)) {
        errors.unitType = "請選擇單位類型";
    }

    const area = Number(draft.area);
    if (draft.area.trim() === "" || !Number.isFinite(area) || area < 1 || area > 99999) {
        errors.area = "請輸入 1–99999 之間的實用呎數";
    }

    const district = draft.district.trim();
    if (district.length < 1 || district.length > 50) {
        errors.district = "請輸入物業地區（1–50 字）";
    }

    const requirement = draft.requirement.trim();
    if (requirement.length > 500) {
        errors.requirement = "要求最多 500 字";
    }

    if (Object.keys(errors).length > 0) {
        return {errors};
    }

    return {
        errors,
        values: {
            name,
            unitType: draft.unitType as UnitType,
            area,
            district,
            requirement,
        },
    };
}
