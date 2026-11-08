import type {ClientQuote} from "@/types/progress";
import {formatMoney, formatQty, isZeroMoney} from "@/utils/money";
import {toPdfText} from "./cjkLineBreak";

// 型別層面只接收 PDF 需要的欄位：沒有 id 等。
export type QuotePdfSource = Pick<ClientQuote, "reference_no" | "customer_name" | "contact_person" | "customer_phone" | "subtotal" | "discount" | "total" | "notes"> & {
    sections: Array<{title: string; line_items: Array<{description: string; unit_price: string; qty: string; amount: string}>}>;
};

// 發票專用資料；沒有則為報價單。
export type InvoiceOptions = {invoiceNo: string; dueDate: string};

export type PdfModel = {
    header: {customerName: string; contactPerson: string; customerPhone: string; referenceNo: string; issuedOn: string; invoiceNo: string | null};
    sections: Array<{number: number; title: string; items: Array<{description: string; unitPrice: string; qty: string; amount: string}>}>;
    totals: Array<{label: string; value: string}>;
    notes: string | null;
    invoice: {dueDate: string} | null;
};

// 由 API 字串直接格式化，不重新計算；只複製需要的欄位，id 永遠不會進入 model。
export function buildQuotePdfModel(quote: QuotePdfSource, issuedOn: string, invoice?: InvoiceOptions): PdfModel {
    // 略過空分類，不佔編號（已按 position 排序）。
    const sections = quote.sections
        .filter(section => section.line_items.length > 0)
        .map((section, index) => ({
            number: index + 1,
            title: toPdfText(section.title),
            items: section.line_items.map(item => ({description: toPdfText(item.description), unitPrice: formatMoney(item.unit_price), qty: formatQty(item.qty), amount: formatMoney(item.amount)})),
        }));

    const totals = [{label: "淨額總計", value: formatMoney(quote.subtotal)}];
    if (!isZeroMoney(quote.discount)) totals.push({label: "折扣", value: `-${formatMoney(quote.discount)}`});
    totals.push({label: "折實總計", value: formatMoney(quote.total)});

    return {
        header: {
            customerName: quote.customer_name,
            contactPerson: quote.contact_person || "-",
            customerPhone: quote.customer_phone || "-",
            referenceNo: quote.reference_no,
            issuedOn,
            invoiceNo: invoice ? invoice.invoiceNo : null,
        },
        sections,
        totals,
        notes: quote.notes?.trim() ? toPdfText(quote.notes) : null,
        invoice: invoice ? {dueDate: invoice.dueDate} : null,
    };
}
