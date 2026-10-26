import {COMPANY_NAME} from "@/constants/contact";

export const Footer = () => {
    return (
        <footer className="relative bg-brand px-6 pt-8 pr-(--fab-clearance) pb-(--fab-clearance) text-center text-sm text-white/70">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent to-transparent" />
            <p className="mb-2 text-xs tracking-[0.4em] text-accent uppercase">Artisanso Engineering</p>
            <p>
                © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
            </p>
        </footer>
    );
};
