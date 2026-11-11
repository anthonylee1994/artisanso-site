import React from "react";
import {Text, View} from "@react-pdf/renderer";
import {COMPANY, QUOTE_SIGN_OFF, QUOTE_TERMS} from "@/constants/company";
import {toPdfText} from "../cjkLineBreak";
import {pdfStyles as s} from "../pdfStyles";
import {RichTextPdf} from "./RichTextPdf";
import type {RichRow} from "@/utils/richText";

export const TermsAndSignature = (props: {issuedOn: string; custom: RichRow[] | null}) => {
    const {issuedOn, custom} = props;
    return (
        <View>
            <Text style={s.termsTitle}>條款及細則</Text>
            {custom ? <RichTextPdf rows={custom} /> : null}
            {(custom ? [] : QUOTE_TERMS).map((term, index) => (
                <View key={term.title} style={s.termRow} wrap={false}>
                    <Text style={s.termNumber}>{index + 1}.</Text>
                    <Text style={s.termBody}>
                        <Text style={s.bold}>{term.title}：</Text>
                        {term.body.map((segment, i) => (
                            <Text key={i} style={segment.bold ? s.bold : undefined}>
                                {toPdfText(segment.text)}
                            </Text>
                        ))}
                    </Text>
                </View>
            ))}

            <View wrap={false}>
                <Text style={s.signOff}>{toPdfText(QUOTE_SIGN_OFF)}</Text>
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
                    <View style={s.signatureColumn}>
                        <Text>接受及確認方</Text>
                        <Text> </Text>
                        <View style={s.signatureSpace} />
                        <View style={s.signatureLine}>
                            <Text>授權簽署</Text>
                            <Text>日期:</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
