import {WA_NUMBER} from "@/constants/contact";
import type {QuoteFormValues} from "@/types";

export function buildWhatsAppUrl(values: QuoteFormValues): string {
    const lines = [
        "你好，我想查詢裝修報價：",
        `稱呼：${values.name}`,
        `單位類型：${values.unitType}`,
        `實用面積：${values.area} 呎`,
        `物業地區：${values.district}`,
        `要求：${values.requirement || "無"}`,
    ];
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
