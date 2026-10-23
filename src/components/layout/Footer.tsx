import {COMPANY_NAME} from "@/constants/contact";

export const Footer = () => {
    return (
        <footer className="bg-brand py-6 text-center text-sm text-white/70">
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </footer>
    );
};
