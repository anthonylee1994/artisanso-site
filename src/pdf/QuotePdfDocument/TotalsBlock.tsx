import React from "react";
import {Text, View} from "@react-pdf/renderer";
import {pdfStyles as s} from "../pdfStyles";
import type {PdfModel} from "../pdfModel";

export const TotalsBlock = (props: {totals: PdfModel["totals"]}) => {
    const {totals} = props;
    return (
        <View wrap={false}>
            {totals.map(total => (
                <View key={total.label} style={s.totals}>
                    <View style={s.totalsBox}>
                        <Text style={s.totalsLabel}>{total.label}:</Text>
                        <Text style={s.totalsValue}>{total.value}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};
