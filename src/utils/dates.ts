// date-only 字串唔經 new Date()，避免時區偏移
export function formatDateOnly(value: string) {
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return "";
    return `${year}年${month}月${day}日`;
}

export function formatDateTime(iso: string) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("zh-HK", {dateStyle: "medium", timeStyle: "short"}).format(date);
}
