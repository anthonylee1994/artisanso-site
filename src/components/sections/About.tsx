import {LuBadgeDollarSign, LuHardHat, LuMapPin, LuRuler} from "react-icons/lu";

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
        <section id="about" className="relative scroll-mt-16 bg-[radial-gradient(circle,rgb(184_134_75/0.18)_1px,transparent_1px)] bg-size-[28px_28px] px-6 py-20 md:px-12 md:py-28">
            <div className="mx-auto max-w-6xl">
                <div className="reveal grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-20">
                    <div>
                        <p className="mb-5 flex items-center gap-3 text-xs tracking-[0.4em] text-accent uppercase">
                            <span aria-hidden="true" className="h-px w-10 bg-accent" />
                            About Us
                        </p>
                        <h2 className="text-5xl leading-[1.1] font-light whitespace-nowrap text-brand md:text-6xl">關於匠方工程</h2>
                    </div>
                    <div className="lg:pt-10">
                        <p className="mb-6 flex items-baseline gap-3">
                            <span className="text-6xl font-light text-accent tabular-nums md:text-7xl">40</span>
                            <span className="text-lg text-brand-light">年裝修經驗</span>
                        </p>
                        <p className="max-w-2xl leading-8 text-brand-light">
                            匠方工程專注住宅及商業單位裝修工程，在行內有口皆碑。我們以質素優先、價錢老實為宗旨，由設計商討、施工到驗收，全程由同一班師傅跟進，確保每個細節都處理到位。我們相信好的裝修就在細節，每個項目按客戶預算和需要度身安排，準時交樓、收費清楚。
                        </p>
                    </div>
                </div>

                <ul className="stagger mt-16 grid border-t border-brand/20 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
                    {SELLING_POINTS.map((p, i) => (
                        <li key={p.title} className="reveal group border-b border-brand/20 py-8 sm:pr-8 lg:border-b-0 lg:not-first:pl-8 lg:not-last:border-r lg:not-last:border-brand/20">
                            <div className="flex items-center justify-between">
                                <span className="text-sm tracking-widest text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                                <p.icon className="h-8 w-8 text-accent transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true" />
                            </div>
                            <h3 className="mt-8 text-xl font-semibold text-brand">{p.title}</h3>
                            <p className="mt-3 leading-7 text-brand-light">{p.text}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};
