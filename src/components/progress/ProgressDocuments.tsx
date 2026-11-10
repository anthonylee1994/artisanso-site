import React from "react";
import {LuDownload} from "react-icons/lu";
import {downloadInvoicePdf, downloadQuotePdf} from "@/pdf/downloadQuotePdf";
import {formatDateOnly} from "@/utils/dates";
import type {ClientInvoice, ClientQuote} from "@/types/progress";
import {SectionHeading} from "./SectionHeading";

type Props = {quotes: ClientQuote[]; invoices: ClientInvoice[]};

type Row = {key: string; title: string; subtitle: string; label: string; onDownload: () => Promise<void>};

const BUTTON_CLASS = "inline-flex min-h-11 items-center gap-2 rounded-md bg-accent px-5 font-semibold text-white hover:bg-accent-dark disabled:opacity-60";

export const ProgressDocuments = (props: Props) => {
    const {quotes, invoices} = props;
    const [busy, setBusy] = React.useState<string | null>(null);
    const [failed, setFailed] = React.useState(false);

    const download = async (row: Row) => {
        setBusy(row.key);
        setFailed(false);
        try {
            await row.onDownload();
        } catch (error) {
            console.error(error);
            setFailed(true);
        } finally {
            setBusy(null);
        }
    };

    const quoteRows: Row[] = quotes.map(quote => ({
        key: `quote:${quote.id}`,
        title: quote.reference_no,
        subtitle: quote.customer_name,
        label: "下載報價單",
        onDownload: () => downloadQuotePdf(quote),
    }));
    const invoiceRows: Row[] = invoices.map(invoice => ({
        key: `invoice:${invoice.id}`,
        title: invoice.invoice_no,
        subtitle: `${invoice.customer_name} · 到期日 ${formatDateOnly(invoice.due_date)}`,
        label: "下載發票單",
        onDownload: () => downloadInvoicePdf(invoice),
    }));

    const renderGroup = (heading: string, rows: Row[]) =>
        rows.length === 0 ? null : (
            <div>
                <h3 className="mb-2 text-lg font-semibold text-brand">{heading}</h3>
                <ul className="divide-y divide-brand/15 border-y border-brand/15">
                    {rows.map(row => (
                        <li key={row.key} className="flex flex-wrap items-center justify-between gap-4 py-5">
                            <div>
                                <p className="font-semibold text-brand">{row.title}</p>
                                <p className="text-sm text-brand-light">{row.subtitle}</p>
                            </div>
                            <button type="button" disabled={busy !== null} onClick={() => void download(row)} className={BUTTON_CLASS}>
                                <LuDownload aria-hidden="true" />
                                {busy === row.key ? "產生中…" : row.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );

    return (
        <section id="progress-documents" aria-labelledby="documents-title" className="scroll-mt-20">
            <SectionHeading id="documents-title" eyebrow="Documents" title="文件" />
            {failed && (
                <p role="alert" className="mb-4 text-red-700">
                    文件產生失敗，請重試。
                </p>
            )}
            <div className="flex flex-col gap-8">
                {renderGroup("報價單", quoteRows)}
                {renderGroup("發票單", invoiceRows)}
            </div>
        </section>
    );
};
