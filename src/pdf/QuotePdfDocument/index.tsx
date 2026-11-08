import React from "react";
import {Document, Page, Text, View} from "@react-pdf/renderer";
import {COMPANY} from "@/constants/company";
import {pdfStyles as s} from "../pdfStyles";
import {ItemsTable} from "./ItemsTable";
import {PdfFooter} from "./PdfFooter";
import {PdfHeader} from "./PdfHeader";
import {PaymentAndSignature} from "./PaymentAndSignature";
import {TermsAndSignature} from "./TermsAndSignature";
import {TotalsBlock} from "./TotalsBlock";
import type {PdfModel} from "../pdfModel";

// 只接收 PdfModel（已剔除所有 id／內部欄位），A4 直向：項目表由第一頁開始，條款及簽署（發票則為付款詳情）另起一頁。
export const QuotePdfDocument = (props: {model: PdfModel}) => {
    const {model} = props;
    return (
        <Document
            title={model.header.invoiceNo !== null ? `發票 ${model.header.invoiceNo}` : `報價單 ${model.header.referenceNo}`}
            author={COMPANY.nameZh}
            creator={COMPANY.nameZh}
            producer={COMPANY.nameZh}
            language="zh-HK"
        >
            <Page size="A4" style={s.page}>
                <PdfHeader header={model.header} />
                <View style={s.body}>
                    <ItemsTable sections={model.sections} />
                    <TotalsBlock totals={model.totals} />
                    {model.notes ? (
                        <View style={s.notes}>
                            <Text style={s.notesTitle} minPresenceAhead={40}>
                                備註
                            </Text>
                            <Text>{model.notes}</Text>
                        </View>
                    ) : null}
                </View>
                <PdfFooter />
            </Page>
            <Page size="A4" style={s.page}>
                <PdfHeader header={model.header} />
                <View style={s.body}>
                    {model.invoice ? <PaymentAndSignature issuedOn={model.header.issuedOn} dueDate={model.invoice.dueDate} /> : <TermsAndSignature issuedOn={model.header.issuedOn} />}
                </View>
                <PdfFooter />
            </Page>
        </Document>
    );
};
