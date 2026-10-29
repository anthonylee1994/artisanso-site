import React from "react";
import {useLightboxStore} from "@/stores/useLightboxStore";

export type {SlideDirection} from "@/stores/useLightboxStore";

export function useLightbox() {
    const state = useLightboxStore();
    const {project, trigger, close, next, prev} = state;
    const isOpen = project !== null;

    // 鎖 body scroll、關閉後 focus 返去觸發嘅 Card
    React.useEffect(() => {
        if (!isOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.documentElement.setAttribute("data-lightbox-open", "");
        return () => {
            document.body.style.overflow = original;
            document.documentElement.removeAttribute("data-lightbox-open");
            trigger?.focus();
        };
    }, [isOpen]);

    // 鍵盤：← → Esc
    React.useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            else if (e.key === "ArrowRight") next();
            else if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);

    // Store 係全域，離開頁面時要關閉
    React.useEffect(() => close, []);

    return {...state, isOpen};
}
