import React from "react";
import {Text, View} from "@react-pdf/renderer";
import {COMPANY} from "@/constants/company";
import {pdfStyles as s} from "../pdfStyles";
import {CompanyLogo} from "./CompanyLogo";
import type {PdfModel} from "../pdfModel";

// 每頁重複：公司抬頭、「報價單」／「發票」、客戶資料框（頁數用 totalPages）。
export const PdfHeader = (props: {header: PdfModel["header"]}) => {
    const {header} = props;
    return (
        <View fixed>
            <View style={s.header}>
                <View style={s.brand}>
                    <CompanyLogo size={40} />
                    <View style={s.brandText}>
                        <Text style={s.brandZh}>{COMPANY.nameZh}</Text>
                        <Text style={s.brandEn}>{COMPANY.nameEn}</Text>
                    </View>
                </View>
                <Text style={s.contact}>
                    電話: {COMPANY.phone} | 電郵: {COMPANY.email} | 網址: {COMPANY.website}
                </Text>
            </View>

            <Text style={s.title}>{header.invoiceNo !== null ? "發票" : "報價單"}</Text>

            <View style={s.infoBox}>
                <View style={s.infoColumn}>
                    <View style={s.infoRow}>
                        <Text style={s.infoLabelLeft}>致:</Text>
                        <Text style={s.infoValue}>{header.customerName}</Text>
                    </View>
                    <View style={s.infoRow}>
                        <Text style={s.infoLabelLeft}>經辦人:</Text>
                        <Text style={s.infoValue}>{header.contactPerson}</Text>
                    </View>
                    <View style={s.infoRow}>
                        <Text style={s.infoLabelLeft}>電話:</Text>
                        <Text style={s.infoValue}>{header.customerPhone}</Text>
                    </View>
                </View>
                <View style={s.infoColumn}>
                    {header.invoiceNo !== null ? (
                        <View style={s.infoRow}>
                            <Text style={s.infoLabelRight}>發票編號:</Text>
                            <Text style={s.infoValue}>{header.invoiceNo}</Text>
                        </View>
                    ) : null}
                    {header.referenceNo !== null ? (
                        <View style={s.infoRow}>
                            <Text style={s.infoLabelRight}>報價參考編號:</Text>
                            <Text style={s.infoValue}>{header.referenceNo}</Text>
                        </View>
                    ) : null}
                    <View style={s.infoRow}>
                        <Text style={s.infoLabelRight}>日期:</Text>
                        <Text style={s.infoValue}>{header.issuedOn}</Text>
                    </View>
                    <View style={s.infoRow}>
                        <Text style={s.infoLabelRight}>頁數:</Text>
                        <Text style={s.infoValueDynamic} render={({totalPages}) => String(totalPages)} />
                    </View>
                </View>
            </View>
        </View>
    );
};
