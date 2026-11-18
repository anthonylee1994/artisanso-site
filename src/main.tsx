import React from "react";
import {App} from "./pages/IndexPage";
import {Navigate} from "react-router-dom";
import {ViteReactSSG} from "vite-react-ssg";
import {projectsLoader} from "./api/projectsApi";
import {ProgressPage} from "./pages/ProgressPage/index";
import "./index.css";

export const createRoot = ViteReactSSG({
    routes: [
        {
            path: "/",
            loader: projectsLoader,
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
        {
            path: "*",
            element: <Navigate to="/" replace />,
        },
    ],
});
