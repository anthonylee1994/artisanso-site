import React from "react";
import type {ClientComment} from "@/types/progress";
import {formatDateTime} from "@/utils/dates";

type CommentThreadProps = {
    comments: ClientComment[];
    truncated: boolean;
    loaded: boolean;
    failed: boolean;
    scrollSignal: number;
    onRefresh: () => void;
};

export const CommentThread = (props: CommentThreadProps) => {
    const endRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (props.scrollSignal > 0) endRef.current?.scrollIntoView({block: "nearest", behavior: "smooth"});
    }, [props.scrollSignal, props.comments.length]);

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-brand-light" aria-live="polite">
                    {props.failed ? "暫時未能載入留言，請稍後重試。" : ""}
                </p>
            </div>
            {props.truncated && <p className="mb-3 text-sm text-brand-light">只顯示最早 1000 則</p>}
            <div role="log" aria-live="polite" aria-busy={!props.loaded} aria-label="留言記錄" className="flex flex-col gap-3">
                {props.loaded && props.comments.length === 0 && <p className="text-brand-light">有任何問題，歡迎在下方留言。</p>}
                {props.comments.map(comment => {
                    const mine = comment.author_role === "client";
                    return (
                        <div key={comment.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] rounded-lg px-4 py-2 ${mine ? "bg-accent/15" : "bg-white"}`}>
                                <p className="text-xs text-brand-light">
                                    <span className="font-semibold">{mine ? "你" : "匠方工程"}</span>
                                    {" · "}
                                    {formatDateTime(comment.created_at)}
                                </p>
                                <p className="mt-1 wrap-break-word whitespace-pre-wrap">{comment.body}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>
        </div>
    );
};
