import React from "react";
import {LuDownload} from "react-icons/lu";
import {downloadQuotePdf, type QuoteDocumentKind} from "@/pdf/downloadQuotePdf";
import type {ClientQuote} from "@/types/progress";
import {SectionHeading} from "./SectionHeading";

const DOWNLOAD_LABEL: Record<QuoteDocumentKind, string> = {quotation: "下載報價單", invoice: "下載發票單"};

export const QuoteDocuments = (props: {quotes: ClientQuote[]}) => {
    const [busy, setBusy] = React.useState<string | null>(null);
    const [failed, setFailed] = React.useState(false);

    const download = async (quote: ClientQuote, kind: QuoteDocumentKind) => {
        setBusy(`${quote.id}:${kind}`);
        setFailed(false);
        try {
            await downloadQuotePdf(quote, kind);
        } catch (error) {
            console.error(error);
            setFailed(true);
        } finally {
            setBusy(null);
        }
    };

    const renderButton = (quote: ClientQuote, kind: QuoteDocumentKind) => {
        const loading = busy === `${quote.id}:${kind}`;
        return (
            <button
                key={kind}
                type="button"
                disabled={busy !== null}
                onClick={() => void download(quote, kind)}
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-accent px-5 font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
            >
                <LuDownload aria-hidden="true" />
                {loading ? "產生中…" : DOWNLOAD_LABEL[kind]}
            </button>
        );
    };

    return (
        <section id="progress-documents" aria-labelledby="documents-title" className="scroll-mt-20">
            <SectionHeading id="documents-title" eyebrow="Documents" title="文件" />
            {failed && (
                <p role="alert" className="mb-4 text-red-700">
                    文件產生失敗，請重試。
                </p>
            )}
            <ul className="divide-y divide-brand/15 border-y border-brand/15">
                {props.quotes.map(quote => (
                    <li key={quote.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                        <div>
                            <p className="font-semibold text-brand">{quote.reference_no}</p>
                            <p className="text-sm text-brand-light">{quote.customer_name}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {quote.quotation_visible && renderButton(quote, "quotation")}
                            {quote.invoice_visible && renderButton(quote, "invoice")}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};
