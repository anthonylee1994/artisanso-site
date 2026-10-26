import {FiCheck} from "react-icons/fi";
import type {ClientMilestoneStatus} from "@/types/progress";

export const Marker = (props: {status: ClientMilestoneStatus}) => {
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
