import type {ClientInvoice, ClientQuote} from "@/types/progress";
import {formatMoney, formatQty, isZeroMoney} from "@/utils/money";
import {toPdfText} from "./cjkLineBreak";

// 型別層面只接收 PDF 需要的欄位：沒有 id 等。
export type QuotePdfSource = Pick<ClientQuote, "reference_no" | "customer_name" | "contact_person" | "customer_phone" | "subtotal" | "discount" | "total" | "notes"> & {
    sections: Array<{title: string; line_items: Array<{description: string; unit_price: string; qty: string; amount: string}>}>;
};

export type InvoicePdfSource = Pick<
    ClientInvoice,
    "invoice_no" | "quote_reference_no" | "due_date" | "customer_name" | "contact_person" | "customer_phone" | "subtotal" | "discount" | "total" | "notes"
> & {
    sections: QuotePdfSource["sections"];
};

export type PdfModel = {
    // referenceNo 為 null 時唔印「報價參考編號」（發票冇填來源報價）。
    header: {customerName: string; contactPerson: string; customerPhone: string; referenceNo: string | null; issuedOn: string; invoiceNo: string | null};
    sections: Array<{number: number; title: string; items: Array<{description: string; unitPrice: string; qty: string; amount: string}>}>;
    totals: Array<{label: string; value: string}>;
    notes: string | null;
    invoice: {dueDate: string} | null;
};

type PdfBody = Pick<PdfModel, "sections" | "totals" | "notes">;

// 由 API 字串直接格式化，不重新計算；只複製需要的欄位，id 永遠不會進入 model。
function buildBody(quote: Pick<QuotePdfSource, "sections" | "subtotal" | "discount" | "total" | "notes">): PdfBody {
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

    return {sections, totals, notes: quote.notes?.trim() ? toPdfText(quote.notes) : null};
}

export function buildQuotePdfModel(quote: QuotePdfSource, issuedOn: string): PdfModel {
    return {
        header: {
            customerName: quote.customer_name,
            contactPerson: quote.contact_person || "-",
            customerPhone: quote.customer_phone || "-",
            referenceNo: quote.reference_no,
            issuedOn,
            invoiceNo: null,
        },
        ...buildBody(quote),
        invoice: null,
    };
}

export function buildInvoicePdfModel(invoice: InvoicePdfSource, issuedOn: string): PdfModel {
    return {
        header: {
            customerName: invoice.customer_name,
            contactPerson: invoice.contact_person || "-",
            customerPhone: invoice.customer_phone || "-",
            referenceNo: invoice.quote_reference_no?.trim() || null,
            issuedOn,
            invoiceNo: invoice.invoice_no,
        },
        ...buildBody(invoice),
        invoice: {dueDate: invoice.due_date},
    };
}
