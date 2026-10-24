import {FiInstagram} from "react-icons/fi";
import {LuMail, LuPhone} from "react-icons/lu";
import {EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE, PHONE_HREF, WA_URL} from "@/constants/contact";
import {SectionTitle} from "@/components/ui/SectionTitle";
import {WhatsAppIcon} from "@/components/ui/WhatsAppIcon";

const CARD_CLASS =
    "group flex h-full min-w-0 flex-col items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:bg-white/10";
const ICON_CLASS = "flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent transition duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white";

export const Contact = () => {
    return (
        <section id="contact" className="relative scroll-mt-16 overflow-clip bg-brand px-8 pt-20 pb-[calc(5rem+var(--fab-clearance))] text-white md:px-12">
            <div aria-hidden="true" className="parallax pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
            <div aria-hidden="true" className="parallax pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-4 border border-accent/20 md:inset-8">
                <span className="absolute -top-px -left-px h-6 w-6 border-t-2 border-l-2 border-accent" />
                <span className="absolute -top-px -right-px h-6 w-6 border-t-2 border-r-2 border-accent" />
                <span className="absolute -bottom-px -left-px h-6 w-6 border-b-2 border-l-2 border-accent" />
                <span className="absolute -right-px -bottom-px h-6 w-6 border-r-2 border-b-2 border-accent" />
            </div>

            <div className="relative mx-auto max-w-4xl text-center">
                <SectionTitle eyebrow="Contact" title="聯絡我們" subtitle="歡迎隨時查詢，我們會盡快回覆" light />
                <ul className="stagger grid gap-4 text-lg sm:grid-cols-3">
                    <li className="reveal min-w-0">
                        <a href={PHONE_HREF} className={CARD_CLASS}>
                            <span className={ICON_CLASS}>
                                <LuPhone className="h-6 w-6" aria-hidden="true" />
                            </span>
                            <span className="text-sm text-white/60">電話</span>
                            <span className="max-w-full text-base break-words text-accent">{PHONE}</span>
                        </a>
                    </li>
                    <li className="reveal min-w-0">
                        <a href={`mailto:${EMAIL}`} className={CARD_CLASS}>
                            <span className={ICON_CLASS}>
                                <LuMail className="h-6 w-6" aria-hidden="true" />
                            </span>
                            <span className="text-sm text-white/60">電郵</span>
                            <span className="max-w-full text-base break-words text-accent">{EMAIL.replace("@", "\u200b@")}</span>
                        </a>
                    </li>
                    <li className="reveal min-w-0">
                        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={CARD_CLASS}>
                            <span className={ICON_CLASS}>
                                <FiInstagram className="h-6 w-6" aria-hidden="true" />
                            </span>
                            <span className="text-sm text-white/60">Instagram</span>
                            <span className="max-w-full text-base break-words text-accent">{INSTAGRAM_HANDLE}</span>
                        </a>
                    </li>
                </ul>
                <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-4">
                    <a
                        href={WA_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-accent px-6 font-bold text-white shadow-md shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accent-dark"
                    >
                        <WhatsAppIcon className="h-6 w-6" />
                        WhatsApp 查詢
                    </a>
                </div>
            </div>
        </section>
    );
};
