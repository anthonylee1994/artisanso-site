import React from "react";

export const LoadingProgress = () => {
    return (
        <div role="status" aria-label="載入中" className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white motion-reduce:animate-none" />
        </div>
    );
};
