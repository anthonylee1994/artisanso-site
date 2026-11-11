import React from "react";
import {Text, View} from "@react-pdf/renderer";
import type {RichRow} from "@/utils/richText";
import {toPdfText} from "../cjkLineBreak";
import {pdfStyles as s} from "../pdfStyles";

// 自訂條款／付款詳情：段落同清單逐行印，bold 片段用粗體。
export const RichTextPdf = (props: {rows: RichRow[]}) => (
    <React.Fragment>
        {props.rows.map((row, index) => (
            <View key={index} style={s.richRow} wrap={false}>
                {row.marker ? <Text style={s.richMarker}>{row.marker}</Text> : null}
                <Text style={s.richBody}>
                    {row.runs.map((run, i) => (
                        <Text key={i} style={run.bold ? s.bold : undefined}>
                            {toPdfText(run.text)}
                        </Text>
                    ))}
                </Text>
            </View>
        ))}
    </React.Fragment>
);
