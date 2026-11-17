import {COMPANY_NAME} from "@/constants/contact";

export const Footer = () => {
    return (
        <footer className="bg-brand relative px-6 pt-8 pr-(--fab-clearance) pb-(--fab-clearance) text-center text-sm text-white/70">
            <div aria-hidden="true" className="via-accent absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent" />
            <p className="text-accent mb-2 text-xs tracking-[0.4em] uppercase">Artisanso Engineering</p>
            <p>
                © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
            </p>
        </footer>
    );
};
