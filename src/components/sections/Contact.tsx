import {FiInstagram} from "react-icons/fi";
import {EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE, PHONE_HREF, WA_URL} from "@/constants/contact";
import {SectionTitle} from "@/components/ui/SectionTitle";
import {WhatsAppIcon} from "@/components/ui/WhatsAppIcon";

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
                    <li>
                        Instagram：
                        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                            {INSTAGRAM_HANDLE}
                        </a>
                    </li>
                </ul>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <a
                        href={WA_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-whatsapp px-6 font-bold text-white transition hover:brightness-95"
                    >
                        <WhatsAppIcon className="h-6 w-6" />
                        WhatsApp 查詢
                    </a>
                    <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-white px-6 font-bold text-brand transition hover:brightness-95"
                    >
                        <FiInstagram className="h-6 w-6" />
                        Instagram
                    </a>
                </div>
            </div>
        </section>
    );
};
