import {create} from "zustand";
import {readUrlCode} from "@/utils/accessCode";

export type AccessPhase = "init" | "needs_code" | "active";

interface AccessState {
    code: string | null;
    phase: AccessPhase;
    rejected: boolean;
    init: () => void;
    submit: (value: string) => void;
    reject: () => void;
}

export const useAccessStore = create<AccessState>(set => ({
    code: null,
    phase: "init",
    rejected: false,
    init: () => {
        const initial = readUrlCode();
        set(initial ? {code: initial, phase: "active"} : {phase: "needs_code"});
    },
    submit: value => set({code: value.trim(), rejected: false, phase: "active"}),
    // 401：丟棄 code，返回 AccessGate
    reject: () => set({code: null, rejected: true, phase: "needs_code"}),
}));
