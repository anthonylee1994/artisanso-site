import React from "react";
import {WA_URL} from "@/constants/contact";
import {useCountdown} from "@/hooks/useCountdown";

type AccessGateProps = {
    rejected: boolean;
    retryAfter?: number;
    onSubmit: (code: string) => void;
};

export const AccessGate = (props: AccessGateProps) => {
    const [value, setValue] = React.useState("");
    const countdown = useCountdown();
    const errorRef = React.useRef<HTMLParagraphElement>(null);
    const locked = countdown.remaining > 0;
    const canSubmit = value.trim() !== "" && !locked;

    React.useEffect(() => {
        if (props.retryAfter !== undefined) countdown.start(props.retryAfter);
    }, [props.retryAfter]);

    React.useEffect(() => {
        if (props.rejected) errorRef.current?.focus();
    }, [props.rejected]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (canSubmit) props.onSubmit(value);
    };

    return (
        <section aria-labelledby="gate-title" className="mx-auto max-w-md rounded-lg bg-white p-6 shadow">
            <h1 id="gate-title" className="mb-4 text-xl font-bold">
                查看工程進度
            </h1>
            <form onSubmit={submit} noValidate>
                <label htmlFor="access-code" className="mb-1 block text-sm font-semibold">
                    存取碼
                </label>
                <input
                    id="access-code"
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="AS-XXXX-XXXX-XXXX-XXXX"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    disabled={locked}
                    aria-describedby="gate-error"
                    aria-invalid={props.rejected}
                    className="mb-3 min-h-11 w-full rounded border border-brand/30 px-3 disabled:bg-surface"
                />
                <p id="gate-error" ref={errorRef} tabIndex={-1} role="alert" className="mb-3 text-sm text-red-700">
                    {locked ? `嘗試次數過多，請 ${countdown.remaining} 秒後再試。` : props.rejected ? "存取碼無效或已失效，請向匠方工程查詢。" : ""}
                </p>
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="min-h-11 w-full rounded bg-accent px-4 font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                    查看進度
                </button>
            </form>
            <p className="mt-4 text-sm text-brand-light">
                存取碼由匠方工程提供。如遺失，請{" "}
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-accent-dark underline">
                    WhatsApp 聯絡我們
                </a>
                。
            </p>
        </section>
    );
};
