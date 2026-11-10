import React from "react";
import {pdf} from "@react-pdf/renderer";
import {QuotePdfDocument} from "./QuotePdfDocument";
import {buildInvoicePdfModel, buildQuotePdfModel, type InvoicePdfSource, type QuotePdfSource} from "./pdfModel";
import {registerFonts} from "./registerFonts";

// 此 module（連同 @react-pdf/renderer 與字型）只經 exportQuotePdf 的 dynamic import 載入，不納入主 bundle。
export async function renderQuotePdf(quote: QuotePdfSource, issuedOn: string): Promise<Blob> {
    registerFonts();
    return pdf(<QuotePdfDocument model={buildQuotePdfModel(quote, issuedOn)} />).toBlob();
}

export async function renderInvoicePdf(invoice: InvoicePdfSource, issuedOn: string): Promise<Blob> {
    registerFonts();
    return pdf(<QuotePdfDocument model={buildInvoicePdfModel(invoice, issuedOn)} />).toBlob();
}
