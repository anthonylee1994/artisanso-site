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
            <header className="bg-brand sticky top-0 z-30 text-white shadow">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-12">
                    <a href="/" className="flex min-h-11 items-center gap-2">
                        <img src="/logo.svg" alt="" width={32} height={32} />
                        <span className="text-lg font-bold">{COMPANY_NAME}</span>
                    </a>
                    <span className="text-accent flex items-center gap-3 text-sm tracking-[0.3em]">
                        <span aria-hidden="true" className="bg-accent h-px w-8" />
                        工程進度
                    </span>
                </div>
            </header>
            <main className="bg-surface text-brand min-h-[70vh] px-4 py-10 md:px-12 md:py-16">
                <div className="mx-auto max-w-5xl">{props.children}</div>
            </main>
        </React.Fragment>
    );
};
