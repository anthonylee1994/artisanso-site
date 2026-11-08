// 報價單 PDF 使用的公司抬頭與標準條款（硬編碼，修改資料請改此處）。
export const COMPANY = {
    nameZh: "匠方工程有限公司",
    nameEn: "Artisanso Engineering Limited",
    phone: "5171 7371",
    email: "info@artisanso.com",
    website: "www.artisanso.com",
};

// 每段由多個片段組成，bold 片段用粗體印。
export type TermSegment = {text: string; bold?: boolean};
export type QuoteTerm = {title: string; body: TermSegment[]};

export const QUOTE_TERMS: QuoteTerm[] = [
    {
        title: "報價有效期",
        body: [{text: "本報價單自發出日起 "}, {text: "7天內", bold: true}, {text: " 有效。逾期或材料價格大幅波動時，本公司保留重新報價之權利。"}],
    },
    {
        title: "貨幣",
        body: [{text: "所有費用均以港幣 (HKD) 計算。"}],
    },
    {
        title: "第三方費用及行政費",
        body: [
            {
                text: "報價不包括任何第三方費用（如大廈管理處按金、申請入紙費、第三方測量或結構工程師費用等）。任何由本公司代客戶採購之物料或代辦手續，將按實際支出實報實銷，並額外加收每張訂單 ",
            },
            {text: "港幣1,000元", bold: true},
            {text: " 之行政處理費。"},
        ],
    },
    {
        title: "付款方式",
        body: [{text: "工程費用將按進度分期支付（一般為：首期30%、中期40%、尾期30%）。工程驗收完成及交付後需即時結清尾數。"}, {text: "所有已支付之款項，除特殊情況外，概不退還。", bold: true}],
    },
    {
        title: "諮詢服務與風險承擔",
        body: [
            {
                text: "本公司將於整個設計及施工期間提供專業諮詢。最終設計方案及施工細節（包括潛在的樓宇結構限制、隱蔽工程如水電老化等風險）會與客戶充分溝通並確認。工程交付入伙後，客戶需自行承擔相關使用風險。",
            },
        ],
    },
    {
        title: "工程啟動及工期",
        body: [
            {text: "工程於收到首期款項及大廈管理處發出之施工許可證後正式啟動。詳細施工範圍及時間表將於工程啟動會議後提供。本工程預計需要至少 "},
            {text: "4週", bold: true},
            {text: " 的施工時間（實際工期可能受天氣、大廈施工限制或物料供應等因素影響）。"},
        ],
    },
    {
        title: "客戶提供之文件及額外評估",
        body: [{text: "客戶需提供大廈管理處之裝修指引及相關圖紙。如報價範圍外需進行任何額外圖紙修改、結構評估或現場勘察分析，將另作附加報價。"}],
    },
    {
        title: "工程變更",
        body: [{text: "如需任何特殊工藝、訂製傢俬、特殊物料處理或於施工期間更改設計，本公司將提供附加報價，客戶確認後方會進行。"}],
    },
];

export const QUOTE_SIGN_OFF = "請在下方簽名作實，以確認接受上述報價及條款與細則。";

// 發票 PDF 第二頁「付款詳情」使用的收款資料。
export const INVOICE_PAYMENT = {
    payee: "Lee Chung Ho",
    bankName: "中國銀行（香港）有限公司 (Bank of China (Hong Kong) Limited)",
    accountName: "Lee Chung Ho",
    accountNo: "012-797-1-0099848",
    lateInterest: "2%",
};
