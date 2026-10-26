import React from "react";

export function useCountdown() {
    const [deadline, setDeadline] = React.useState<number | null>(null);
    const [remaining, setRemaining] = React.useState(0);

    React.useEffect(() => {
        if (deadline === null) return;
        const tick = () => {
            const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
            setRemaining(left);
            if (left === 0) setDeadline(null);
        };
        tick();
        const id = window.setInterval(tick, 250);
        return () => window.clearInterval(id);
    }, [deadline]);

    const start = (seconds: number) => setDeadline(Date.now() + seconds * 1000);

    return {remaining, start};
}
