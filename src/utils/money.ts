// 金額一律是 API 回傳嘅兩位小數字串；此處只做 parse／格式化，絕不轉為 Number。
const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

function toCents(value: string): bigint {
    if (!MONEY_PATTERN.test(value)) throw new Error(`Invalid money value: ${value}`);
    const [whole, fraction = ""] = value.split(".");
    return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
}

export function isZeroMoney(value: string) {
    return toCents(value) === 0n;
}

// "459000" → "459,000.00"（冇貨幣符號，供 PDF 表格使用）；格式唔正確則原樣回傳。
export function formatMoney(value: string) {
    if (!MONEY_PATTERN.test(value)) return value;
    const cents = toCents(value);
    const whole = (cents / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${whole}.${(cents % 100n).toString().padStart(2, "0")}`;
}

// "1.00" → "1"、"2.50" → "2.5"：只去尾 0。
export function formatQty(value: string) {
    if (!value.includes(".")) return value;
    return value.replace(/0+$/, "").replace(/\.$/, "");
}
