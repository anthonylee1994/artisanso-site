import React from "react";
import {clearStoredCode, readStoredCode, storeCode, takeUrlCode} from "@/utils/accessCode";

export type AccessPhase = "init" | "needs_code" | "active";

export function useAccessCode() {
    const [code, setCode] = React.useState<string | null>(null);
    const [phase, setPhase] = React.useState<AccessPhase>("init");
    const [rejected, setRejected] = React.useState(false);
    const [persistFailed, setPersistFailed] = React.useState(false);
    const started = React.useRef(false);

    // fragment 讀完即清走，StrictMode 重跑 effect 時唔可以再讀一次
    React.useEffect(() => {
        if (started.current) return;
        started.current = true;
        const initial = takeUrlCode() ?? readStoredCode();
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

    // 驗證成功先儲存
    const confirm = (verified: string) => setPersistFailed(!storeCode(verified));

    // 401：清除 code，返回 AccessGate
    const reject = () => {
        clearStoredCode();
        setCode(null);
        setRejected(true);
        setPhase("needs_code");
    };

    const logout = () => {
        clearStoredCode();
        setCode(null);
        setRejected(false);
        setPersistFailed(false);
        setPhase("needs_code");
    };

    return {code, phase, rejected, persistFailed, submit, confirm, reject, logout};
}
