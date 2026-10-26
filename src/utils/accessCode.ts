// 讀取 URL query 入面嘅 code（?code=...），唔改動網址。只可喺 effect / event handler 內呼叫
export function readUrlCode() {
    return new URLSearchParams(window.location.search).get("code")?.trim() || null;
}
