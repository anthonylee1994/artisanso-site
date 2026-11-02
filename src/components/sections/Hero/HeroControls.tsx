import React from "react";
import {LuChevronLeft, LuChevronRight} from "react-icons/lu";

type HeroControlsProps = {
    current: number;
    count: number;
    onGoTo: (target: number) => void;
};

const BUTTON_CLASS = "flex h-11 w-11 items-center justify-center rounded-md border border-white/30 transition-colors hover:border-accent hover:bg-accent";

function pad(n: number) {
    return String(n).padStart(2, "0");
}

export const HeroControls = (props: HeroControlsProps) => {
    return (
        <div className="flex items-center gap-4">
            <p aria-hidden="true" className="text-sm tracking-widest tabular-nums">
                <span className="text-accent">{pad(props.current + 1)}</span>
                <span className="text-white/60"> / {pad(props.count)}</span>
            </p>
            <div className="flex gap-2">
                <button type="button" aria-label="上一張" onClick={() => props.onGoTo(props.current - 1)} className={BUTTON_CLASS}>
                    <LuChevronLeft aria-hidden="true" className="h-5 w-5" />
                </button>
                <button type="button" aria-label="下一張" onClick={() => props.onGoTo(props.current + 1)} className={BUTTON_CLASS}>
                    <LuChevronRight aria-hidden="true" className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};
