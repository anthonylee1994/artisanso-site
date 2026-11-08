const NBSP = "\u00a0";
const BREAKABLE = /[\u3000-\u9fff\uff00-\uffef\u00a0]/;
// 避頭：不可出現在行首；避尾：不可出現在行尾。
const CLOSING = /[、。，．：；！？）」』〕】》〉…,.:;!?)\]%\u00a0]/;
const OPENING = /[（「『〔【《〈(\[$]/;
const ALNUM = /[A-Za-z0-9]/;

// react-pdf 使用 Knuth-Plass 斷行：一般空格有彈性、中文斷點則沒有，它會傾向在空格處斷行，令中文段落提早換行。
// 所以 PDF 文字的空格全部轉為 NBSP（黏住前一個字），整段變成「沒有彈性」，react-pdf 會 fallback 逐行填滿。
export function toPdfText(text: string): string {
    return text.replace(/ /g, NBSP);
}

// 拆成逐字斷行點；標點／NBSP 黏住前一個字，開括號黏住後一個字，連續英數字不拆開。
export function cjkSyllables(word: string): string[] {
    const tokens: string[] = [];
    let opening = "";
    Array.from(word).forEach(char => {
        const last = tokens.length - 1;
        if (OPENING.test(char)) {
            opening += char;
            return;
        }
        if (last >= 0 && !opening && (CLOSING.test(char) || (ALNUM.test(char) && ALNUM.test(tokens[last].slice(-1))))) {
            tokens[last] += char;
            return;
        }
        tokens.push(opening + char);
        opening = "";
    });
    if (opening) tokens.push(opening);
    return tokens;
}

// react-pdf hyphenation callback：每個斷行點後面加 ""（變成 0 寬 glue），斷行時不會補上連字號。
export function hyphenateCjk(word: string): string[] {
    return BREAKABLE.test(word) ? cjkSyllables(word).flatMap(token => [token, ""]) : [word];
}
