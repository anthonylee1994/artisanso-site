import React from "react";
import {useAccessStore} from "@/stores/useAccessStore";

export type {AccessPhase} from "@/stores/useAccessStore";

export function useAccessCode() {
    const state = useAccessStore();

    React.useEffect(() => {
        state.init();
    }, []);

    return {code: state.code, phase: state.phase, rejected: state.rejected, submit: state.submit, reject: state.reject};
}
