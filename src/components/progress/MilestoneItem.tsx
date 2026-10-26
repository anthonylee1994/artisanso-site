import React from "react";
import {FiCheck} from "react-icons/fi";
import type {ClientMilestone, ClientMilestoneStatus} from "@/types/progress";
import {formatDateOnly} from "@/utils/dates";

const STATUS_LABEL: Record<ClientMilestoneStatus, string> = {pending: "待開始", in_progress: "進行中", done: "已完成"};

function describeDate(milestone: ClientMilestone) {
    if (milestone.status === "done" && milestone.completed_on) return `完成於 ${formatDateOnly(milestone.completed_on)}`;
    if (milestone.due_on) return `預計 ${formatDateOnly(milestone.due_on)}`;
    return null;
}

const Marker = (props: {status: ClientMilestoneStatus}) => {
    if (props.status === "done") {
        return (
            <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                <FiCheck />
            </span>
        );
    }
    if (props.status === "in_progress") return <span aria-hidden="true" className="block h-6 w-6 rounded-full border-4 border-accent/30 bg-accent" />;
    return <span aria-hidden="true" className="block h-6 w-6 rounded-full border-2 border-brand/30 bg-white" />;
};

export const MilestoneItem = (props: {milestone: ClientMilestone; last: boolean}) => {
    const {milestone} = props;
    const date = describeDate(milestone);

    return (
        <li aria-current={milestone.status === "in_progress" ? "step" : undefined} className="relative flex gap-4 pb-6 last:pb-0">
            {!props.last && <span aria-hidden="true" className="absolute top-6 bottom-0 left-3 w-px -translate-x-1/2 bg-brand/20" />}
            <div className="relative z-10 shrink-0">
                <Marker status={milestone.status} />
            </div>
            <div className={`min-w-0 flex-1 rounded-lg px-3 py-1 ${milestone.status === "in_progress" ? "bg-accent/10" : ""}`}>
                <h3 className="font-bold break-words">{milestone.title}</h3>
                <p className="text-sm text-brand-light">
                    {STATUS_LABEL[milestone.status]}
                    {date && ` · ${date}`}
                </p>
                {milestone.client_summary && <p className="mt-2 text-sm break-words whitespace-pre-line">{milestone.client_summary}</p>}
            </div>
        </li>
    );
};
