import React from "react";
import {readUrlCode} from "@/utils/accessCode";

export type AccessPhase = "init" | "needs_code" | "active";

export function useAccessCode() {
    const [code, setCode] = React.useState<string | null>(null);
    const [phase, setPhase] = React.useState<AccessPhase>("init");
    const [rejected, setRejected] = React.useState(false);

    React.useEffect(() => {
        const initial = readUrlCode();
        if (initial) {
            setCode(initial);
            setPhase("active");
        } else {
            setPhase("needs_code");
        }
    }, []);

    const submit = (value: string) => {
        setCode(value.trim());
        setRejected(false);
        setPhase("active");
    };

    // 401：丟棄 code，返回 AccessGate
    const reject = () => {
        setCode(null);
        setRejected(true);
        setPhase("needs_code");
    };

    return {code, phase, rejected, submit, reject};
}
