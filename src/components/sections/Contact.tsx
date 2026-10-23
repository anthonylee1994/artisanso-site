import {EMAIL, PHONE, PHONE_HREF, WA_URL} from "../../constants/contact";
import {SectionTitle} from "../ui/SectionTitle";
import {WhatsAppIcon} from "../ui/WhatsAppIcon";

export const Contact = () => {
    return (
        <section id="contact" className="scroll-mt-16 bg-brand px-4 py-16 text-white">
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
                    className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded bg-whatsapp px-6 font-bold text-white transition hover:brightness-95"
                >
                    <WhatsAppIcon className="h-6 w-6" />
                    WhatsApp 查詢
                </a>
            </div>
        </section>
    );
};
