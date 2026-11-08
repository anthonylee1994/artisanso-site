import {StyleSheet} from "@react-pdf/renderer";

export const FONT_FAMILY = "NotoSansTC";

const BORDER = 1.5;

// 欄寬：項目 ｜ 詳細內容 ｜ 單價 ｜ 數量 ｜ 金額
export const COLUMN_WIDTHS = ["10%", "42%", "16%", "9%", "23%"] as const;

const FONT_SIZE = 10;
// react-pdf 將 unitless lineHeight 按「同一個 style 的 fontSize」換算，所以兩者要一併設定。
const TEXT = {fontSize: FONT_SIZE, lineHeight: 1.45};

// 注意：react-pdf 有 bug，render prop 的 Text（頁數、頁尾）只要繼承到 lineHeight 就不會印出，所以 lineHeight 只設在內容區塊，不設在 page。
export const pdfStyles = StyleSheet.create({
    page: {paddingTop: 28, paddingHorizontal: 32, paddingBottom: 48, fontFamily: FONT_FAMILY, fontSize: FONT_SIZE, color: "#000"},
    body: TEXT,
    header: {flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start"},
    brand: {flexDirection: "row", alignItems: "center"},
    brandText: {marginLeft: 8},
    brandZh: {fontSize: 15, fontWeight: 700, lineHeight: 1.2},
    brandEn: {fontSize: 10.5, lineHeight: 1.2},
    contact: {fontSize: 8, marginTop: 4},
    title: {fontSize: 44, lineHeight: 1.1, marginTop: 14, marginBottom: 8},
    infoBox: {flexDirection: "row", borderWidth: 2, paddingVertical: 3, paddingHorizontal: 6, marginBottom: 16},
    infoColumn: {flex: 1},
    infoRow: {flexDirection: "row"},
    infoLabelLeft: {...TEXT, width: 64},
    infoLabelRight: {...TEXT, width: 84},
    infoValue: {...TEXT, flex: 1},
    infoValueDynamic: {flex: 1},
    table: {borderWidth: BORDER},
    headerRow: {flexDirection: "row", borderBottomWidth: BORDER},
    row: {flexDirection: "row"},
    cell: {paddingVertical: 1.5, paddingHorizontal: 6},
    cellDivider: {borderLeftWidth: BORDER},
    headerText: {fontWeight: 700},
    center: {textAlign: "center"},
    right: {textAlign: "right"},
    bulletRow: {flexDirection: "row", paddingLeft: 18},
    bullet: {width: 16},
    bulletText: {flex: 1},
    tableEnd: {height: 18},
    totals: {flexDirection: "row", justifyContent: "flex-end"},
    totalsBox: {width: COLUMN_WIDTHS[4], borderWidth: BORDER, borderTopWidth: 0, paddingVertical: 2, paddingHorizontal: 6},
    totalsLabel: {fontWeight: 700},
    totalsValue: {textAlign: "right", fontSize: 11},
    notes: {marginTop: 14},
    notesTitle: {textDecoration: "underline", marginBottom: 2},
    termsTitle: {textDecoration: "underline", marginBottom: 4},
    paymentRow: {flexDirection: "row", paddingLeft: 6},
    paymentBullet: {width: 20},
    paymentBody: {flex: 1},
    termRow: {flexDirection: "row", marginBottom: 2},
    termNumber: {width: 26, textAlign: "right", paddingRight: 8},
    termBody: {flex: 1},
    bold: {fontWeight: 700},
    signOff: {marginTop: 14},
    signatures: {flexDirection: "row", justifyContent: "space-between", marginTop: 20},
    signatureColumn: {width: "40%"},
    signatureSpace: {height: 80},
    signatureLine: {borderTopWidth: BORDER, paddingTop: 2},
    underline: {textDecoration: "underline"},
    footer: {position: "absolute", bottom: 22, left: 0, right: 0, textAlign: "center", fontSize: 9},
});
