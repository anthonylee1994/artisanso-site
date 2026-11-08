import React from "react";
import {useClientQuotesStore} from "@/stores/useClientQuotesStore";

export function useClientQuotes(code: string | null, onUnauthorized: () => void) {
    const {quotes, load, cancel, clear} = useClientQuotesStore();

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

    return {quotes, reload};
}
