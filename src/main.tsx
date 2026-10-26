import React from "react";
import {ViteReactSSG} from "vite-react-ssg";
import {App} from "./app";
import {ProgressPage} from "./pages/ProgressPage/index";
import "./index.css";

export const createRoot = ViteReactSSG({
    routes: [
        {
            path: "/",
            element: (
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            ),
        },
        {
            path: "/progress",
            element: (
                <React.StrictMode>
                    <ProgressPage />
                </React.StrictMode>
            ),
        },
    ],
});
