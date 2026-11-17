import {FiInstagram} from "react-icons/fi";
import {LuArrowUpRight, LuMail, LuPhone} from "react-icons/lu";
import {EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE, PHONE_HREF, WA_URL} from "@/constants/contact";
import {WhatsAppIcon} from "@/components/ui/WhatsAppIcon";

const ROW_CLASS = "group flex items-center gap-4 py-6 transition-colors md:gap-6 md:py-8";

export const Contact = () => {
    return (
        <section id="contact" className="bg-brand relative scroll-mt-16 overflow-clip px-6 pt-20 pb-[calc(5rem+var(--fab-clearance))] text-white md:px-12 md:pt-28">
            <div aria-hidden="true" className="parallax bg-accent/25 pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl" />
            <div aria-hidden="true" className="parallax bg-accent/20 pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-3xl" />

            <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
                <div className="reveal">
                    <p className="text-accent mb-5 flex items-center gap-3 text-xs tracking-[0.4em] uppercase">
                        <span aria-hidden="true" className="bg-accent h-px w-10" />
                        Contact
                    </p>
                    <h2 className="text-5xl leading-[1.1] font-light text-balance md:text-7xl">聯絡我們</h2>
                    <p className="mt-6 max-w-md text-lg text-white/70">歡迎隨時查詢，我們會盡快回覆</p>
                    <a
                        href={WA_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-accent hover:bg-accent-dark mt-10 inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-8 font-semibold text-white transition-colors"
                    >
                        <WhatsAppIcon className="h-6 w-6" />
                        WhatsApp 查詢
                    </a>
                </div>

                <ul className="stagger divide-y divide-white/15 border-y border-white/15">
                    <li className="reveal">
                        <a href={PHONE_HREF} className={ROW_CLASS}>
                            <LuPhone aria-hidden="true" className="text-accent h-8 w-8 shrink-0" />
                            <span className="w-24 shrink-0 text-base text-white/60">電話</span>
                            <span className="group-hover:text-accent min-w-0 flex-1 text-xl wrap-break-word transition-colors md:text-2xl">{PHONE}</span>
                            <LuArrowUpRight aria-hidden="true" className="group-hover:text-accent h-5 w-5 shrink-0 text-white/40 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                    </li>
                    <li className="reveal">
                        <a href={`mailto:${EMAIL}`} className={ROW_CLASS}>
                            <LuMail aria-hidden="true" className="text-accent h-8 w-8 shrink-0" />
                            <span className="w-24 shrink-0 text-base text-white/60">電郵</span>
                            <span className="group-hover:text-accent min-w-0 flex-1 text-xl wrap-break-word transition-colors md:text-2xl">{EMAIL.replace("@", "\u200b@")}</span>
                            <LuArrowUpRight aria-hidden="true" className="group-hover:text-accent h-5 w-5 shrink-0 text-white/40 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                    </li>
                    <li className="reveal">
                        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={ROW_CLASS}>
                            <FiInstagram aria-hidden="true" className="text-accent h-8 w-8 shrink-0" />
                            <span className="w-24 shrink-0 text-base text-white/60">Instagram</span>
                            <span className="group-hover:text-accent min-w-0 flex-1 text-xl wrap-break-word transition-colors md:text-2xl">{INSTAGRAM_HANDLE}</span>
                            <LuArrowUpRight aria-hidden="true" className="group-hover:text-accent h-5 w-5 shrink-0 text-white/40 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    );
};
