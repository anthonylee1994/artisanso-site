import {create} from "zustand";
import {clientGet, clientPost, toApiError} from "@/api/clientApi";
import type {ApiError, ClientComment} from "@/types/progress";

const PER_PAGE = 100;
const MAX_PAGES = 10;

export type SendResult = {kind: "sent"} | {kind: "maybe_sent"} | {kind: "failed"; error: ApiError};

interface ClientCommentsState {
    comments: ClientComment[];
    truncated: boolean;
    loaded: boolean;
    failed: boolean;
    load: (code: string, onUnauthorized: () => void) => Promise<void>;
    send: (code: string, body: string, onUnauthorized: () => void) => Promise<SendResult>;
    cancel: () => void;
    clear: () => void;
}

let controller: AbortController | null = null;

async function fetchAllComments(code: string, signal?: AbortSignal) {
    const comments: ClientComment[] = [];
    let truncated = false;
    for (let page = 1; page <= MAX_PAGES; page++) {
        const res = await clientGet<ClientComment[]>(`/comments?page=${page}&per_page=${PER_PAGE}`, code, signal);
        comments.push(...(res.data ?? []));
        const totalPages = res.meta?.total_pages ?? page;
        if (page >= totalPages) break;
        if (page === MAX_PAGES) truncated = true;
    }
    return {comments, truncated};
}

export const useClientCommentsStore = create<ClientCommentsState>(set => {
    // 攞晒留言寫入 store；signal 被取消或者失敗時回傳 null
    async function fetchInto(code: string, onUnauthorized: () => void, signal?: AbortSignal) {
        try {
            const result = await fetchAllComments(code, signal);
            set({comments: result.comments, truncated: result.truncated, failed: false, loaded: true});
            return result.comments;
        } catch (e) {
            if (signal?.aborted) return null;
            if (toApiError(e).status === 401) onUnauthorized();
            else set({failed: true});
            return null;
        }
    }

    return {
        comments: [],
        truncated: false,
        loaded: false,
        failed: false,
        load: async (code, onUnauthorized) => {
            controller?.abort();
            const current = new AbortController();
            controller = current;
            await fetchInto(code, onUnauthorized, current.signal);
        },
        send: async (code, body, onUnauthorized) => {
            if (!code) return {kind: "failed", error: {status: 0, code: "no_code", message: ""}};
            try {
                await clientPost("/comments", code, {comment: {body}});
            } catch (e) {
                const error = toApiError(e);
                if (error.status === 401) {
                    onUnauthorized();
                    return {kind: "failed", error};
                }
                if (error.status === 422 || error.status === 429) return {kind: "failed", error};
                // 網絡錯誤 / 5xx：先 refetch，睇下留言其實有冇送出，唔自動重試
                const latest = await fetchInto(code, onUnauthorized);
                const lastOwn = latest?.findLast(c => c.author_role === "client");
                if (lastOwn?.body.trim() === body) return {kind: "maybe_sent"};
                return {kind: "failed", error};
            }
            await fetchInto(code, onUnauthorized);
            return {kind: "sent"};
        },
        cancel: () => controller?.abort(),
        clear: () => {
            controller?.abort();
            set({comments: [], loaded: false, failed: false});
        },
    };
});
