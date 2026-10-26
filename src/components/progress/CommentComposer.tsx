import React from "react";
import type {SendResult} from "@/hooks/useClientComments";
import {useCountdown} from "@/hooks/useCountdown";

const MAX_LENGTH = 2000;

type CommentComposerProps = {
    draft: string;
    onDraftChange: (value: string) => void;
    onSend: (body: string) => Promise<SendResult>;
    onSent: () => void;
};

function extractBodyError(details: unknown) {
    const body = (details as {body?: unknown} | undefined)?.body;
    if (Array.isArray(body)) return body.join("、");
    return typeof body === "string" ? body : null;
}

export const CommentComposer = (props: CommentComposerProps) => {
    const [sending, setSending] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const countdown = useCountdown();
    const body = props.draft.trim();
    const valid = body.length >= 1 && body.length <= MAX_LENGTH;
    const locked = countdown.remaining > 0;
    const canSend = valid && !sending && !locked;

    const send = async () => {
        if (!canSend) return;
        setSending(true);
        setError(null);
        const result = await props.onSend(body);
        setSending(false);
        if (result.kind === "sent") {
            props.onDraftChange("");
            props.onSent();
        } else if (result.kind === "maybe_sent") {
            props.onDraftChange("");
            props.onSent();
        } else if (result.error.status === 422) {
            setError(extractBodyError(result.error.details) ?? "留言內容無效，請檢查後再試。");
        } else if (result.error.status === 429) {
            const seconds = result.error.retryAfter ?? 60;
            countdown.start(seconds);
            setError("rate_limited");
        } else if (result.error.status !== 401) {
            setError("暫時未能送出，請稍後重試。");
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        send();
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            send();
        }
    };

    const errorText = error === "rate_limited" ? (locked ? `留言太頻密，請 ${countdown.remaining} 秒後再試。` : "") : error;

    return (
        <form onSubmit={onSubmit} className="mt-6" noValidate>
            <label htmlFor="comment-body" className="mb-1 block text-sm font-semibold">
                留言
            </label>
            <textarea
                id="comment-body"
                value={props.draft}
                onChange={e => props.onDraftChange(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={sending}
                rows={4}
                aria-describedby="comment-hint comment-error"
                aria-invalid={Boolean(errorText) || body.length > MAX_LENGTH}
                className="w-full rounded border border-brand/30 bg-white px-3 py-2 disabled:bg-surface"
            />
            <div className="mt-1 flex justify-between text-xs text-brand-light">
                <span id="comment-hint">留言送出後無法修改或刪除。</span>
                <span className={body.length > MAX_LENGTH ? "text-red-700" : ""}>
                    {body.length} / {MAX_LENGTH}
                </span>
            </div>
            <p id="comment-error" role="alert" className="mt-2 text-sm text-red-700">
                {errorText}
            </p>
            <button
                type="submit"
                disabled={!canSend}
                className="mt-2 min-h-11 rounded bg-accent px-6 font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
                {sending ? "送出中…" : "送出"}
            </button>
        </form>
    );
};
