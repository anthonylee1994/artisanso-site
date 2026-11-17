import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {fileURLToPath} from "node:url";
import {defineConfig} from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        // @react-pdf/renderer (~1.2 MB) is lazy-loaded only on PDF download; the main bundle stays ~200 kB.
        chunkSizeWarningLimit: 1300,
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
