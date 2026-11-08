import React from "react";
import {pdf} from "@react-pdf/renderer";
import {QuotePdfDocument} from "./QuotePdfDocument";
import {buildQuotePdfModel, type InvoiceOptions, type QuotePdfSource} from "./pdfModel";
import {registerFonts} from "./registerFonts";

// 此 module（連同 @react-pdf/renderer 與字型）只經 exportQuotePdf 的 dynamic import 載入，不納入主 bundle。
export async function renderQuotePdf(quote: QuotePdfSource, issuedOn: string, invoice?: InvoiceOptions): Promise<Blob> {
    registerFonts();
    return pdf(<QuotePdfDocument model={buildQuotePdfModel(quote, issuedOn, invoice)} />).toBlob();
}
