import React from "react";

export type ProgressTab = {
    id: string;
    label: string;
};

type ProgressTabsProps = {
    tabs: ProgressTab[];
    active: string;
    onChange: (id: string) => void;
};

export function tabId(id: string) {
    return `progress-tab-${id}`;
}

export function panelId(id: string) {
    return `progress-panel-${id}`;
}

export const ProgressTabs = (props: ProgressTabsProps) => {
    const listRef = React.useRef<HTMLDivElement>(null);

    // 方向鍵 / Home / End 切換分頁，焦點跟住移動
    const onKeyDown = (e: React.KeyboardEvent) => {
        const index = props.tabs.findIndex(t => t.id === props.active);
        const last = props.tabs.length - 1;
        const next =
            e.key === "ArrowRight" ? (index + 1) % props.tabs.length : e.key === "ArrowLeft" ? (index - 1 + props.tabs.length) % props.tabs.length : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
        if (next < 0) return;
        e.preventDefault();
        const target = props.tabs[next];
        props.onChange(target.id);
        listRef.current?.querySelector<HTMLElement>(`#${tabId(target.id)}`)?.focus();
    };

    return (
        <div ref={listRef} role="tablist" aria-label="工程進度分頁" onKeyDown={onKeyDown} className="mb-10 flex gap-8 border-b border-brand/15">
            {props.tabs.map(tab => {
                const selected = tab.id === props.active;
                return (
                    <button
                        key={tab.id}
                        id={tabId(tab.id)}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls={panelId(tab.id)}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => props.onChange(tab.id)}
                        className={`-mb-px min-h-12 border-b-2 text-lg transition-colors ${selected ? "border-accent font-semibold text-brand" : "border-transparent text-brand-light hover:text-accent"}`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};
