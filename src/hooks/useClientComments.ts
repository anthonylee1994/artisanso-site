import React from "react";
import {clientGet, clientPost, toApiError} from "@/api/clientApi";
import type {ApiError, ClientComment} from "@/types/progress";

const PER_PAGE = 100;
const MAX_PAGES = 10;

export type SendResult = {kind: "sent"} | {kind: "maybe_sent"} | {kind: "failed"; error: ApiError};

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

export function useClientComments(code: string | null, onUnauthorized: () => void) {
    const [comments, setComments] = React.useState<ClientComment[]>([]);
    const [truncated, setTruncated] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    const [failed, setFailed] = React.useState(false);
    const [nonce, setNonce] = React.useState(0);

    const load = async (signal?: AbortSignal) => {
        if (!code) return null;
        try {
            const result = await fetchAllComments(code, signal);
            setComments(result.comments);
            setTruncated(result.truncated);
            setFailed(false);
            setLoaded(true);
            return result.comments;
        } catch (e) {
            if (signal?.aborted) return null;
            if (toApiError(e).status === 401) onUnauthorized();
            else setFailed(true);
            return null;
        }
    };

    React.useEffect(() => {
        if (!code) {
            setComments([]);
            setLoaded(false);
            setFailed(false);
            return;
        }
        const controller = new AbortController();
        load(controller.signal);
        return () => controller.abort();
    }, [code, nonce]);

    const reload = () => setNonce(n => n + 1);

    const send = async (body: string): Promise<SendResult> => {
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
            const latest = await load();
            const lastOwn = latest?.findLast(c => c.author_role === "client");
            if (lastOwn?.body.trim() === body) return {kind: "maybe_sent"};
            return {kind: "failed", error};
        }
        await load();
        return {kind: "sent"};
    };

    return {comments, truncated, loaded, failed, reload, send};
}
