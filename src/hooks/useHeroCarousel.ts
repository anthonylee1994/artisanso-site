import React from "react";

export const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;

export function useHeroCarousel(count: number) {
    const [index, setIndex] = React.useState(0);
    const [paused, setPaused] = React.useState(false);
    const swipeStart = React.useRef<{x: number; y: number} | null>(null);

    const current = index % count;

    const goTo = (target: number) => setIndex((target + count) % count);

    // 觸控 / 手寫筆橫向掃動換 slide，直向掃動仍然係捲動頁面（touch-pan-y）
    const onPointerDown = (e: React.PointerEvent) => {
        if (e.pointerType === "mouse") return;
        swipeStart.current = {x: e.clientX, y: e.clientY};
    };

    const onPointerUp = (e: React.PointerEvent) => {
        const start = swipeStart.current;
        swipeStart.current = null;
        if (!start || count < 2) return;
        const dx = e.clientX - start.x;
        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(e.clientY - start.y)) {
            goTo(dx > 0 ? current - 1 : current + 1);
        }
    };

    const onPointerCancel = () => {
        swipeStart.current = null;
    };

    // current 放入依賴，手動切換後計時會重新開始，同進度條同步
    React.useEffect(() => {
        if (paused || count < 2) return;
        const timer = window.setInterval(() => setIndex(i => (i + 1) % count), AUTOPLAY_MS);
        return () => window.clearInterval(timer);
    }, [paused, count, current]);

    return {
        current,
        paused,
        setPaused,
        goTo,
        swipeHandlers: {onPointerDown, onPointerUp, onPointerCancel},
    };
}
