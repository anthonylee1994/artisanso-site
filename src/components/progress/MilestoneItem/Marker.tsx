import {FiCheck} from "react-icons/fi";
import type {ClientMilestoneStatus} from "@/types/progress";

export const Marker = (props: {status: ClientMilestoneStatus}) => {
    if (props.status === "done") {
        return (
            <span aria-hidden="true" className="bg-accent flex h-8 w-8 items-center justify-center rounded-full text-white">
                <FiCheck size={18} />
            </span>
        );
    }
    if (props.status === "in_progress") {
        return (
            <span aria-hidden="true" className="border-accent flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white">
                <span className="bg-accent block h-3 w-3 animate-pulse rounded-full motion-reduce:animate-none" />
            </span>
        );
    }
    return <span aria-hidden="true" className="border-brand/25 bg-surface block h-8 w-8 rounded-full border-2" />;
};
