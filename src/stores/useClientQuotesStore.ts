import {create} from "zustand";
import {clientGet, toApiError} from "@/api/clientApi";
import {hasLineItems, sortSections} from "@/utils/documentSections";
import type {ClientQuote} from "@/types/progress";

interface ClientQuotesState {
    quotes: ClientQuote[];
    load: (code: string, onUnauthorized: () => void) => Promise<void>;
    cancel: () => void;
    clear: () => void;
}

let controller: AbortController | null = null;

// 排序，並略過冇細項嘅報價（PDF 冇內容）
function normalize(quotes: ClientQuote[]): ClientQuote[] {
    return quotes.map(quote => ({...quote, sections: sortSections(quote.sections)})).filter(quote => hasLineItems(quote.sections));
}

export const useClientQuotesStore = create<ClientQuotesState>(set => ({
    quotes: [],
    // 文件係附加功能：載入失敗只當冇文件，不阻擋進度頁
    load: async (code, onUnauthorized) => {
        controller?.abort();
        const current = new AbortController();
        controller = current;
        try {
            const res = await clientGet<ClientQuote[]>("/quotes", code, current.signal);
            set({quotes: normalize(res.data ?? [])});
        } catch (e) {
            if (current.signal.aborted) return;
            if (toApiError(e).status === 401) {
                set({quotes: []});
                onUnauthorized();
            }
        }
    },
    cancel: () => controller?.abort(),
    clear: () => {
        controller?.abort();
        set({quotes: []});
    },
}));
