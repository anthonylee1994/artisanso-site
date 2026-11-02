import type {ClientMilestone, ClientMilestoneStatus} from "@/types/progress";
import {formatDateOnly} from "@/utils/dates";
import {Marker} from "./Marker";

const STATUS_LABEL: Record<ClientMilestoneStatus, string> = {pending: "待開始", in_progress: "進行中", done: "已完成"};

function describeDate(milestone: ClientMilestone) {
    if (milestone.status === "done" && milestone.completed_on) return `完成於 ${formatDateOnly(milestone.completed_on)}`;
    if (milestone.due_on) return `預計 ${formatDateOnly(milestone.due_on)}`;
    return null;
}

export const MilestoneItem = (props: {milestone: ClientMilestone; last: boolean}) => {
    const {milestone} = props;
    const date = describeDate(milestone);
    const active = milestone.status === "in_progress";

    return (
        <li aria-current={active ? "step" : undefined} className="relative flex gap-5 pb-8 last:pb-0 md:gap-8">
            {!props.last && <span aria-hidden="true" className={`absolute top-8 bottom-0 left-4 w-px -translate-x-1/2 ${milestone.status === "done" ? "bg-accent" : "bg-brand/20"}`} />}
            <div className="relative z-10 shrink-0">
                <Marker status={milestone.status} />
            </div>
            <div className={`min-w-0 flex-1 rounded-lg ${active ? "border border-accent/30 bg-white p-5 shadow-sm" : "py-1"}`}>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-brand-light">
                    <span className={active ? "font-semibold text-accent" : ""}>{STATUS_LABEL[milestone.status]}</span>
                    {date && <span>{date}</span>}
                </p>
                <h3 className={`mt-1 text-xl wrap-break-word md:text-2xl ${milestone.status === "pending" ? "text-brand-light" : "font-semibold"}`}>{milestone.title}</h3>
                {milestone.client_summary && <p className="mt-3 leading-7 wrap-break-word whitespace-pre-line text-brand-light">{milestone.client_summary}</p>}
            </div>
        </li>
    );
};
