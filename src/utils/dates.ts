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

// 香港今日嘅日期（YYYY-MM-DD）
export function todayInHongKong(now: Date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {timeZone: "Asia/Hong_Kong", year: "numeric", month: "2-digit", day: "2-digit"}).formatToParts(now);
    const pick = (type: string) => parts.find(part => part.type === type)?.value ?? "";
    return `${pick("year")}-${pick("month")}-${pick("day")}`;
}
