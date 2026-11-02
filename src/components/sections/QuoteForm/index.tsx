import React from "react";
import {FiChevronDown} from "react-icons/fi";
import {UNIT_TYPES, type QuoteFormDraft, type QuoteFormErrors} from "@/types";
import {FIELD_ORDER, validateQuote} from "@/utils/validateQuote";
import {buildWhatsAppUrl} from "@/utils/whatsapp";
import {WhatsAppIcon} from "@/components/ui/WhatsAppIcon";
import {Field} from "./Field";

const EMPTY: QuoteFormDraft = {
    name: "",
    unitType: "",
    area: "",
    district: "",
    requirement: "",
};

const STEPS = [
    {title: "填寫資料", text: "簡單五項，一分鐘完成"},
    {title: "WhatsApp 傳送", text: "一鍵帶住你的資料開啟對話"},
    {title: "專人跟進", text: "我們會盡快回覆並安排報價"},
];

const FIELD_CLASS =
    "min-h-12 w-full rounded-md border border-brand/20 bg-surface/60 px-4 py-2 transition-colors focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/30 focus:outline-none";

export const QuoteForm = () => {
    const [draft, setDraft] = React.useState<QuoteFormDraft>(EMPTY);
    const [errors, setErrors] = React.useState<QuoteFormErrors>({});
    const formRef = React.useRef<HTMLFormElement>(null);

    const update = (key: keyof QuoteFormDraft, value: string) => {
        setDraft({...draft, [key]: value});
        if (errors[key]) setErrors({...errors, [key]: undefined});
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = validateQuote(draft);
        setErrors(result.errors);

        if (!result.values) {
            const firstKey = FIELD_ORDER.find(k => result.errors[k]);
            if (firstKey) {
                formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
            }
            return;
        }

        window.open(buildWhatsAppUrl(result.values), "_blank", "noopener");
    };

    const ariaFor = (key: keyof QuoteFormDraft) => ({
        "aria-invalid": errors[key] ? true : undefined,
        "aria-describedby": errors[key] ? `${key}-error` : undefined,
    });

    return (
        <section id="quote" className="scroll-mt-16 px-6 pt-20 pb-[calc(5rem+var(--fab-clearance))] md:px-12 md:pt-28">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
                <div className="reveal lg:sticky lg:top-28 lg:self-start">
                    <p className="mb-5 flex items-center gap-3 text-xs tracking-[0.4em] text-accent uppercase">
                        <span aria-hidden="true" className="h-px w-10 bg-accent" />
                        Get a Quote
                    </p>
                    <h2 className="text-5xl leading-[1.1] font-light text-balance text-brand md:text-7xl">即時報價</h2>
                    <p className="mt-6 max-w-md text-lg text-brand-light">填妥資料，一鍵透過 WhatsApp 傳送給我們</p>

                    <ol className="mt-10 divide-y divide-brand/15 border-y border-brand/15">
                        {STEPS.map((step, i) => (
                            <li key={step.title} className="flex items-baseline gap-5 py-5">
                                <span className="text-sm text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                                <span>
                                    <span className="block text-lg font-semibold text-brand">{step.title}</span>
                                    <span className="text-brand-light">{step.text}</span>
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>

                <form ref={formRef} onSubmit={onSubmit} noValidate className="reveal space-y-6 rounded-lg border border-brand/10 bg-white p-6 shadow-sm md:p-10">
                    <Field id="name" label="稱呼" required error={errors.name}>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="例：李先生"
                            autoComplete="name"
                            value={draft.name}
                            onChange={e => update("name", e.target.value)}
                            className={FIELD_CLASS}
                            {...ariaFor("name")}
                        />
                    </Field>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field id="unitType" label="單位類型" required error={errors.unitType}>
                            <div className="relative">
                                <select
                                    id="unitType"
                                    name="unitType"
                                    value={draft.unitType}
                                    onChange={e => update("unitType", e.target.value)}
                                    className={`${FIELD_CLASS} appearance-none pr-10`}
                                    {...ariaFor("unitType")}
                                >
                                    <option value="">請選擇</option>
                                    {UNIT_TYPES.map(t => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                                <FiChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-brand" size={20} />
                            </div>
                        </Field>

                        <Field id="area" label="實用呎數" required error={errors.area}>
                            <input
                                id="area"
                                name="area"
                                type="number"
                                inputMode="numeric"
                                placeholder="例：700"
                                min={1}
                                max={99999}
                                value={draft.area}
                                onChange={e => update("area", e.target.value)}
                                className={FIELD_CLASS}
                                {...ariaFor("area")}
                            />
                        </Field>
                    </div>

                    <Field id="district" label="物業地區" required error={errors.district}>
                        <input
                            id="district"
                            name="district"
                            type="text"
                            maxLength={50}
                            placeholder="例：大埔、荃灣、元朗"
                            value={draft.district}
                            onChange={e => update("district", e.target.value)}
                            className={FIELD_CLASS}
                            {...ariaFor("district")}
                        />
                    </Field>

                    <Field id="requirement" label="要求（選填）" error={errors.requirement} hint={<div className="mt-1 text-right text-xs text-brand-light">{draft.requirement.length} / 500</div>}>
                        <textarea
                            id="requirement"
                            name="requirement"
                            rows={4}
                            maxLength={500}
                            value={draft.requirement}
                            onChange={e => update("requirement", e.target.value)}
                            className={FIELD_CLASS}
                            {...ariaFor("requirement")}
                        />
                    </Field>

                    <button
                        type="submit"
                        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-md bg-accent font-semibold text-white shadow-md shadow-accent/30 transition-colors hover:bg-accent-dark"
                    >
                        <WhatsAppIcon className="h-6 w-6" />
                        WhatsApp 即時報價
                    </button>
                </form>
            </div>
        </section>
    );
};
