import React from "react";

export function useActiveSection(ids: string[]) {
    const [active, setActive] = React.useState(ids[0] ?? "");
    const key = ids.join("|");

    React.useEffect(() => {
        const elements = key
            .split("|")
            .map(id => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        const observer = new IntersectionObserver(
            entries => {
                const visible = entries.find(e => e.isIntersecting);
                if (visible) setActive(visible.target.id);
            },
            {rootMargin: "-40% 0px -55% 0px"}
        );

        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [key]);

    return active;
}
