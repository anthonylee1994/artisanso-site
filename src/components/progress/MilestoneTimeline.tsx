import React from "react";
import type {ClientMilestone} from "@/types/progress";
import {MilestoneItem} from "./MilestoneItem";

export const MilestoneTimeline = (props: {milestones: ClientMilestone[]}) => {
    return (
        <section id="progress-milestones" aria-labelledby="milestones-title" className="mb-10 scroll-mt-20">
            <h2 id="milestones-title" className="mb-4 text-xl font-bold">
                進度
            </h2>
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
