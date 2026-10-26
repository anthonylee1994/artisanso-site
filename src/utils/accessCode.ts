const STORAGE_KEY = "artisanso.progress.code";

// 讀取 URL query 入面嘅 code（?code=...），並即時清走。只可喺 effect / event handler 內呼叫
export function takeUrlCode() {
    const {pathname, search, hash} = window.location;
    const query = new URLSearchParams(search);
    const code = query.get("code")?.trim();
    if (query.has("code")) {
        query.delete("code");
        const rest = query.toString();
        window.history.replaceState(null, "", pathname + (rest ? `?${rest}` : "") + hash);
    }
    return code || null;
}

export function readStoredCode() {
    try {
        return window.localStorage.getItem(STORAGE_KEY)?.trim() || null;
    } catch {
        return null;
    }
}

// 回傳是否成功寫入（私隱模式可能失敗，降級為只存記憶體）
export function storeCode(code: string) {
    try {
        window.localStorage.setItem(STORAGE_KEY, code);
        return true;
    } catch {
        return false;
    }
}

export function clearStoredCode() {
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        // 儲存被禁用，忽略
    }
}
