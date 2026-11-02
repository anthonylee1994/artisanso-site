import {FiCheck} from "react-icons/fi";
import type {ClientMilestoneStatus} from "@/types/progress";

export const Marker = (props: {status: ClientMilestoneStatus}) => {
    if (props.status === "done") {
        return (
            <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
                <FiCheck size={18} />
            </span>
        );
    }
    if (props.status === "in_progress") {
        return (
            <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent bg-white">
                <span className="block h-3 w-3 animate-pulse rounded-full bg-accent motion-reduce:animate-none" />
            </span>
        );
    }
    return <span aria-hidden="true" className="block h-8 w-8 rounded-full border-2 border-brand/25 bg-surface" />;
};
