import React from "react";
import {Text, View} from "@react-pdf/renderer";
import {COLUMN_WIDTHS, pdfStyles as s} from "../pdfStyles";
import type {PdfModel} from "../pdfModel";

type Props = {
    // 分類標題行：number + title；細項行：item。兩者共用同一組欄位，令直線連貫。
    number?: number;
    title?: string;
    item?: PdfModel["sections"][number]["items"][number];
};

export const ItemRow = (props: Props) => {
    const {number, title, item} = props;
    return (
        <View style={s.row}>
            <View style={[s.cell, {width: COLUMN_WIDTHS[0]}]}>
                <Text style={s.center}>{number ?? ""}</Text>
            </View>
            <View style={[s.cell, s.cellDivider, {width: COLUMN_WIDTHS[1]}]}>
                {item ? (
                    <View style={s.bulletRow}>
                        <Text style={s.bullet}>•</Text>
                        <Text style={s.bulletText}>{item.description}</Text>
                    </View>
                ) : (
                    <Text>{title}：</Text>
                )}
            </View>
            <View style={[s.cell, s.cellDivider, {width: COLUMN_WIDTHS[2]}]}>
                <Text style={s.right}>{item?.unitPrice ?? ""}</Text>
            </View>
            <View style={[s.cell, s.cellDivider, {width: COLUMN_WIDTHS[3]}]}>
                <Text style={s.center}>{item?.qty ?? ""}</Text>
            </View>
            <View style={[s.cell, s.cellDivider, {width: COLUMN_WIDTHS[4]}]}>
                <Text style={s.right}>{item?.amount ?? ""}</Text>
            </View>
        </View>
    );
};
