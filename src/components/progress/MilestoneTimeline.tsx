import type {ClientMilestone} from "@/types/progress";
import {MilestoneItem} from "./MilestoneItem/index";
import {SectionHeading} from "./SectionHeading";

export const MilestoneTimeline = (props: {milestones: ClientMilestone[]}) => {
    return (
        <section id="progress-milestones" aria-labelledby="milestones-title" className="scroll-mt-20">
            <SectionHeading id="milestones-title" eyebrow="Progress" title="進度" />
            {props.milestones.length === 0 ? (
                <p className="text-brand-light">工程進度更新稍後會顯示在此。</p>
            ) : (
                <ol>
                    {props.milestones.map((m, i) => (
                        <MilestoneItem key={m.id} milestone={m} last={i === props.milestones.length - 1} />
                    ))}
                </ol>
            )}
        </section>
    );
};
