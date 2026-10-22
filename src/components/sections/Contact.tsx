import React from "react";
import {EMAIL, PHONE, PHONE_HREF, WA_URL} from "../../constants/Contact";
import {SectionTitle} from "../ui/SectionTitle";
import {WhatsAppIcon} from "../ui/WhatsAppIcon";

export const Contact = () => {
    return (
        <section id="contact" className="bg-brand scroll-mt-16 px-4 py-16 text-white">
            <div className="mx-auto max-w-2xl text-center">
                <SectionTitle title="聯絡我們" light />
                <ul className="space-y-4 text-lg">
                    <li>
                        電話：
                        <a href={PHONE_HREF} className="text-accent underline">
                            {PHONE}
                        </a>
                    </li>
                    <li>
                        電郵：
                        <a href={`mailto:${EMAIL}`} className="text-accent underline">
                            {EMAIL}
                        </a>
                    </li>
                </ul>
                <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-whatsapp mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded px-6 font-bold text-white transition hover:brightness-95"
                >
                    <WhatsAppIcon className="h-6 w-6" />
                    WhatsApp 查詢
                </a>
            </div>
        </section>
    );
};
