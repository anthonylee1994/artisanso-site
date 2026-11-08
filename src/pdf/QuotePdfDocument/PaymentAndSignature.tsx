import React from "react";
import {Text, View} from "@react-pdf/renderer";
import {COMPANY, INVOICE_PAYMENT} from "@/constants/company";
import {formatDateOnly} from "@/utils/dates";
import {toPdfText} from "../cjkLineBreak";
import {pdfStyles as s} from "../pdfStyles";

// 發票第二頁：付款詳情＋公司簽署。
export const PaymentAndSignature = (props: {issuedOn: string; dueDate: string}) => {
    const {issuedOn, dueDate} = props;
    const items = [
        [`此發票/賬單之到期日為 ${formatDateOnly(dueDate)}。`],
        [`支票須劃線，並註明收款人為 ${INVOICE_PAYMENT.payee}。`],
        [
            "銀行入賬付款：請參閱下方銀行資料，並交回銀行入數紙（存款單）。",
            `銀行名稱：${INVOICE_PAYMENT.bankName}`,
            `戶口名稱：${INVOICE_PAYMENT.accountName}`,
            `銀行帳號：${INVOICE_PAYMENT.accountNo}`,
        ],
        [`逾期將按月收取 ${INVOICE_PAYMENT.lateInterest} 利息。`],
    ];
    return (
        <View>
            <Text style={s.termsTitle}>付款詳情</Text>
            {items.map(lines => (
                <View key={lines[0]} style={s.paymentRow} wrap={false}>
                    <Text style={s.paymentBullet}>•</Text>
                    <View style={s.paymentBody}>
                        {lines.map(line => (
                            <Text key={line}>{toPdfText(line)}</Text>
                        ))}
                    </View>
                </View>
            ))}

            <View wrap={false}>
                <View style={s.signatures}>
                    <View style={s.signatureColumn}>
                        <Text>代表</Text>
                        <Text>{COMPANY.nameZh}</Text>
                        <View style={s.signatureSpace} />
                        <View style={s.signatureLine}>
                            <Text>授權簽署</Text>
                            <Text>
                                日期: <Text style={s.underline}>{issuedOn}</Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
