import React from "react";
import {Text, View} from "@react-pdf/renderer";
import {COLUMN_WIDTHS, pdfStyles as s} from "../pdfStyles";
import {ItemRow} from "./ItemRow";
import type {PdfModel} from "../pdfModel";

const HEADINGS = [
    {label: "項目", align: undefined},
    {label: "詳細內容", align: undefined},
    {label: "單價 ($)", align: s.right},
    {label: "數量", align: s.center},
    {label: "金額 ($)", align: s.right},
];

export const ItemsTable = (props: {sections: PdfModel["sections"]}) => {
    const {sections} = props;
    return (
        <View style={s.table}>
            {/* 表頭跨頁重複 */}
            <View style={s.headerRow} fixed>
                {HEADINGS.map((heading, index) => (
                    <View key={heading.label} style={index === 0 ? [s.cell, {width: COLUMN_WIDTHS[index]}] : [s.cell, s.cellDivider, {width: COLUMN_WIDTHS[index]}]}>
                        <Text style={heading.align ? [s.headerText, heading.align] : s.headerText}>{heading.label}</Text>
                    </View>
                ))}
            </View>

            {sections.map(section => (
                <React.Fragment key={section.number}>
                    {/* 分類標題與首個細項綁在一起，避免標題孤零零留在頁底 */}
                    <View wrap={false}>
                        <ItemRow number={section.number} title={section.title} />
                        <ItemRow item={section.items[0]} />
                    </View>
                    {section.items.slice(1).map((item, index) => (
                        <View key={index} wrap={false}>
                            <ItemRow item={item} />
                        </View>
                    ))}
                </React.Fragment>
            ))}

            <View style={s.row}>
                <View style={[s.tableEnd, {width: COLUMN_WIDTHS[0]}]} />
                {COLUMN_WIDTHS.slice(1).map((width, index) => (
                    <View key={index} style={[s.tableEnd, s.cellDivider, {width}]} />
                ))}
            </View>
        </View>
    );
};
