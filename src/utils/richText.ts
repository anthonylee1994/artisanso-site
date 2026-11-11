// 條款／付款詳情的 rich text（HTML）只容許段落、粗體、清單；PDF 與 editor 都只認呢幾種結構。
export type RichRun = {text: string; bold: boolean};
// marker 為 null 即普通段落；清單項目為 "•" 或 "1."。
export type RichRow = {marker: string | null; runs: RichRun[]};

function collectRuns(node: Node, bold: boolean, runs: RichRun[]): void {
    node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            if (child.textContent) runs.push({text: child.textContent, bold});
            return;
        }
        if (!(child instanceof Element)) return;
        const tag = child.tagName.toLowerCase();
        if (tag === "ul" || tag === "ol") return; // 巢狀清單由 collectRows 處理
        if (tag === "br") runs.push({text: "\n", bold});
        else collectRuns(child, bold || tag === "strong" || tag === "b", runs);
    });
}

// listsOnly：li 內嘅段落已併入該項文字，只需處理巢狀清單。
function collectRows(parent: Element, rows: RichRow[], listsOnly = false): void {
    parent.childNodes.forEach(child => {
        if (!(child instanceof Element)) return;
        const tag = child.tagName.toLowerCase();
        if (tag === "ul" || tag === "ol") {
            let n = 0;
            child.childNodes.forEach(item => {
                if (!(item instanceof Element) || item.tagName.toLowerCase() !== "li") return;
                const runs: RichRun[] = [];
                collectRuns(item, false, runs);
                n += 1;
                rows.push({marker: tag === "ul" ? "•" : `${n}.`, runs});
                collectRows(item, rows, true);
            });
        } else if (!listsOnly && tag !== "li") {
            const runs: RichRun[] = [];
            collectRuns(child, false, runs);
            rows.push({marker: null, runs});
        }
    });
}

// 空白或沒有內容回傳 null（呼叫方即用默認文字）。
export function parseRichText(html: string | null): RichRow[] | null {
    if (!html?.trim()) return null;
    const rows: RichRow[] = [];
    collectRows(new DOMParser().parseFromString(html, "text/html").body, rows);
    const filled = rows.filter(row => row.runs.some(run => run.text.trim()));
    return filled.length > 0 ? rows : null;
}
