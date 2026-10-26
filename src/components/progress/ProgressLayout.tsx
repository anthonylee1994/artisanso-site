import React from "react";
import {Head} from "vite-react-ssg";
import {COMPANY_NAME} from "@/constants/contact";

type ProgressLayoutProps = {
    children: React.ReactNode;
};

export const ProgressLayout = (props: ProgressLayoutProps) => {
    return (
        <React.Fragment>
            <Head>
                <title>工程進度｜匠方工程</title>
                <meta name="robots" content="noindex, nofollow, noarchive" />
                <meta name="referrer" content="no-referrer" />
            </Head>
            <header className="sticky top-0 z-30 bg-brand text-white shadow">
                <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 lg:px-0">
                    <div className="flex min-h-11 items-center gap-2">
                        <img src="/logo.svg" alt="" width={32} height={32} />
                        <span className="text-lg font-bold">{COMPANY_NAME}</span>
                        <span className="text-sm text-white/60">· 工程進度</span>
                    </div>
                </div>
            </header>
            <main className="min-h-[70vh] bg-surface px-4 py-8 text-brand">
                <div className="mx-auto max-w-3xl">{props.children}</div>
            </main>
        </React.Fragment>
    );
};
