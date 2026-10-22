import React from "react";
import {WA_URL} from "../../constants/contact";
import {WhatsAppIcon} from "./WhatsAppIcon";

export const FloatingWhatsApp = () => {
    return (
        <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp 查詢"
            className="bg-whatsapp fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105 md:right-6 md:bottom-6"
        >
            <WhatsAppIcon className="h-8 w-8" />
        </a>
    );
};
