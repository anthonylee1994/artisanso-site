import React from "react";
import {useClientProjectStore} from "@/stores/useClientProjectStore";

export function useClientProject(code: string | null, onUnauthorized: () => void) {
    const {project, error, load, cancel, clear} = useClientProjectStore();

    React.useEffect(() => {
        if (!code) {
            clear();
            return;
        }
        load(code, onUnauthorized);
        return cancel;
    }, [code]);

    const reload = () => {
        if (code) load(code, onUnauthorized);
    };

    return {project, error, reload};
}
