import React from "react";
import {useClientCommentsStore} from "@/stores/useClientCommentsStore";

export type {SendResult} from "@/stores/useClientCommentsStore";

export function useClientComments(code: string | null, onUnauthorized: () => void) {
    const {comments, truncated, loaded, failed, load, send, cancel, clear} = useClientCommentsStore();

    React.useEffect(() => {
        if (!code) {
            clear();
            return;
        }
        load(code, onUnauthorized);
        return cancel;
    }, [code]);

    const reload = () => {
        if (code) load(code, onUnauthorized);
    };

    return {
        comments,
        truncated,
        loaded,
        failed,
        reload,
        send: (body: string) => send(code ?? "", body, onUnauthorized),
    };
}
