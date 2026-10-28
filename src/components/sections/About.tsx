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
                <p className="reveal mx-auto max-w-3xl text-center leading-8">
                    匠方工程專注住宅及商業單位裝修工程，擁有40年經驗，在行內有絕皆口碑。我們一直以質素優先、價錢老實為宗旨，由設計商討、施工到驗收，全程由同一班師傅跟進，確保每個細節都處理到位。我們相信好的裝修就在細節，每個項目均按客戶預算和需要度身安排，準時交樓、收費清楚。
                </p>
                <ul className="stagger mt-14 grid gap-6 sm:grid-cols-2">
                    {SELLING_POINTS.map((p, i) => (
                        <li key={p.title} className="reveal group relative overflow-hidden rounded-lg bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                            <span aria-hidden="true" className="absolute top-3 right-4 text-5xl font-bold text-accent/25 transition-colors duration-300 group-hover:text-accent/40">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent transition duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white">
                                <p.icon className="h-7 w-7" aria-hidden="true" />
                            </div>
                            <h3 className="relative mt-4 pr-14 font-bold">{p.title}</h3>
                            <p className="relative mt-2 text-sm leading-7 text-brand-light">{p.text}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};
