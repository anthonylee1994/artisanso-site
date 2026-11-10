import {create} from "zustand";
import {clientGet, toApiError} from "@/api/clientApi";
import {hasLineItems, sortSections} from "@/utils/documentSections";
import type {ClientInvoice} from "@/types/progress";

interface ClientInvoicesState {
    invoices: ClientInvoice[];
    load: (code: string, onUnauthorized: () => void) => Promise<void>;
    cancel: () => void;
    clear: () => void;
}

let controller: AbortController | null = null;

// 排序，並略過冇細項嘅發票（PDF 冇內容）
function normalize(invoices: ClientInvoice[]): ClientInvoice[] {
    return invoices.map(invoice => ({...invoice, sections: sortSections(invoice.sections)})).filter(invoice => hasLineItems(invoice.sections));
}

export const useClientInvoicesStore = create<ClientInvoicesState>(set => ({
    invoices: [],
    // 文件係附加功能：載入失敗只當冇文件，不阻擋進度頁
    load: async (code, onUnauthorized) => {
        controller?.abort();
        const current = new AbortController();
        controller = current;
        try {
            const res = await clientGet<ClientInvoice[]>("/invoices", code, current.signal);
            set({invoices: normalize(res.data ?? [])});
        } catch (e) {
            if (current.signal.aborted) return;
            if (toApiError(e).status === 401) {
                set({invoices: []});
                onUnauthorized();
            }
        }
    },
    cancel: () => controller?.abort(),
    clear: () => {
        controller?.abort();
        set({invoices: []});
    },
}));
