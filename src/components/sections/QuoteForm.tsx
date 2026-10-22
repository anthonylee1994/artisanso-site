import React from "react";
import {UNIT_TYPES, type QuoteFormDraft, type QuoteFormErrors} from "../../types";
import {FIELD_ORDER, validateQuote} from "../../utils/validateQuote";
import {buildWhatsAppUrl} from "../../utils/whatsapp";
import {SectionTitle} from "../ui/SectionTitle";
import {WhatsAppIcon} from "../ui/WhatsAppIcon";

const EMPTY: QuoteFormDraft = {
    name: "",
    unitType: "",
    area: "",
    district: "",
    requirement: "",
};

const FIELD_CLASS = "min-h-11 w-full rounded border border-brand/30 bg-white px-3 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40";

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

    const errorText = (key: keyof QuoteFormDraft) =>
        errors[key] && (
            <p id={`${key}-error`} role="alert" className="mt-1 text-sm text-red-600">
                {errors[key]}
            </p>
        );

    const ariaFor = (key: keyof QuoteFormDraft) => ({
        "aria-invalid": errors[key] ? true : undefined,
        "aria-describedby": errors[key] ? `${key}-error` : undefined,
    });

    return (
        <section id="quote" className="scroll-mt-16 px-4 py-16">
            <div className="mx-auto max-w-xl">
                <SectionTitle title="即時報價" subtitle="填妥資料，一鍵透過 WhatsApp 傳送給我們" />
                <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5 rounded-lg bg-white p-6 shadow-sm">
                    <div>
                        <label htmlFor="name" className="mb-1 block font-semibold">
                            稱呼 <span className="text-red-600">*</span>
                        </label>
                        <input id="name" name="name" type="text" autoComplete="name" value={draft.name} onChange={e => update("name", e.target.value)} className={FIELD_CLASS} {...ariaFor("name")} />
                        {errorText("name")}
                    </div>

                    <div>
                        <label htmlFor="unitType" className="mb-1 block font-semibold">
                            單位類型 <span className="text-red-600">*</span>
                        </label>
                        <select id="unitType" name="unitType" value={draft.unitType} onChange={e => update("unitType", e.target.value)} className={FIELD_CLASS} {...ariaFor("unitType")}>
                            <option value="">請選擇</option>
                            {UNIT_TYPES.map(t => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                        {errorText("unitType")}
                    </div>

                    <div>
                        <label htmlFor="area" className="mb-1 block font-semibold">
                            實用呎數 <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="area"
                            name="area"
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={99999}
                            value={draft.area}
                            onChange={e => update("area", e.target.value)}
                            className={FIELD_CLASS}
                            {...ariaFor("area")}
                        />
                        {errorText("area")}
                    </div>

                    <div>
                        <label htmlFor="district" className="mb-1 block font-semibold">
                            物業地區 <span className="text-red-600">*</span>
                        </label>
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
                        {errorText("district")}
                    </div>

                    <div>
                        <label htmlFor="requirement" className="mb-1 block font-semibold">
                            要求（選填）
                        </label>
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
                        <div className="text-right text-xs text-brand-light">{draft.requirement.length} / 500</div>
                        {errorText("requirement")}
                    </div>

                    <button type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded bg-whatsapp font-bold text-white transition hover:brightness-95">
                        <WhatsAppIcon className="h-6 w-6" />
                        WhatsApp 即時報價
                    </button>
                </form>
            </div>
        </section>
    );
};
