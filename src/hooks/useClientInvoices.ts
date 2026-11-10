import React from "react";
import {useClientInvoicesStore} from "@/stores/useClientInvoicesStore";

export function useClientInvoices(code: string | null, onUnauthorized: () => void) {
    const {invoices, load, cancel, clear} = useClientInvoicesStore();

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

    return {invoices, reload};
}
