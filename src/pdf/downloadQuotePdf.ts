import type {ClientInvoice, ClientQuote} from "@/types/progress";
import {todayInHongKong} from "@/utils/dates";

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
export async function downloadQuotePdf(quote: ClientQuote) {
    const {renderQuotePdf} = await import("./renderQuotePdf");
    const blob = await renderQuotePdf(quote, todayInHongKong());
    triggerDownload(blob, `quotation-${safeName(quote.reference_no)}.pdf`);
}

export async function downloadInvoicePdf(invoice: ClientInvoice) {
    const {renderInvoicePdf} = await import("./renderQuotePdf");
    const blob = await renderInvoicePdf(invoice, todayInHongKong());
    triggerDownload(blob, `invoice-${safeName(invoice.invoice_no)}.pdf`);
}
