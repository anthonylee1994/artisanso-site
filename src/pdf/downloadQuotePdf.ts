import type {ClientQuote} from "@/types/progress";
import {todayInHongKong} from "@/utils/dates";

export type QuoteDocumentKind = "quotation" | "invoice";

function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // 畀 browser 有時間開始下載先 revoke
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeName(value: string) {
    return value.replace(/[^A-Za-z0-9._-]+/g, "-");
}

// PDF 模組（連同 @react-pdf/renderer 與字型）只經呢度嘅 dynamic import 載入，唔納入主 bundle。
export async function downloadQuotePdf(quote: ClientQuote, kind: QuoteDocumentKind) {
    const invoice = kind === "invoice" && quote.invoice_visible && quote.invoice_no && quote.due_date ? {invoiceNo: quote.invoice_no, dueDate: quote.due_date} : undefined;
    if (kind === "invoice" && !invoice) throw new Error("invoice not available");
    if (kind === "quotation" && !quote.quotation_visible) throw new Error("quotation not available");

    const {renderQuotePdf} = await import("./renderQuotePdf");
    const blob = await renderQuotePdf(quote, todayInHongKong(), invoice);
    triggerDownload(blob, invoice ? `invoice-${safeName(invoice.invoiceNo)}.pdf` : `quotation-${safeName(quote.reference_no)}.pdf`);
}
