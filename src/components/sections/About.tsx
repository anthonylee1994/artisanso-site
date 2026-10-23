import {LuBadgeDollarSign, LuHardHat, LuMapPin, LuRuler} from "react-icons/lu";
import {SectionTitle} from "@/components/ui/SectionTitle";

const SELLING_POINTS = [
    {
        icon: LuRuler,
        title: "免費上門量度報價",
        text: "專人上門量度，當場說明工程範圍及預算。",
    },
    {
        icon: LuBadgeDollarSign,
        title: "價錢透明，無隱藏收費",
        text: "報價逐項列明，完工後不會突然加價。",
    },
    {
        icon: LuHardHat,
        title: "專業師傅團隊",
        text: "水電、木工、泥水、油漆，均由自家師傅負責。",
    },
    {
        icon: LuMapPin,
        title: "服務香港各區",
        text: "本地團隊，上門快、售後跟進方便。",
    },
];

export const About = () => {
    return (
        <section id="about" className="relative scroll-mt-16 bg-[radial-gradient(circle,rgb(184_134_75/0.18)_1px,transparent_1px)] bg-size-[28px_28px] px-4 py-20">
            <div className="mx-auto max-w-6xl">
                <SectionTitle eyebrow="About Us" title="關於匠方工程" />
                <p className="reveal mx-auto max-w-2xl text-center leading-8">
                    匠方工程專注住宅及商業單位裝修工程，由設計商討、施工到驗收，全程由同一班師傅跟進。我們相信好的裝修就在細節，每個項目都按客戶預算和需要度身安排，準時交樓、價錢清楚。
                </p>
                <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {SELLING_POINTS.map((p, i) => (
                        <li
                            key={p.title}
                            className="reveal group relative overflow-hidden rounded-lg bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                        >
                            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                            <span aria-hidden="true" className="absolute top-2 right-4 text-5xl font-bold text-accent/10 transition-colors duration-300 group-hover:text-accent/20">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent transition duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white">
                                <p.icon className="h-8 w-8" aria-hidden="true" />
                            </div>
                            <h3 className="relative mt-4 font-bold">{p.title}</h3>
                            <p className="relative mt-2 text-sm text-brand-light">{p.text}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};
