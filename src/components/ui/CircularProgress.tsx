import React from "react";

export const CircularProgress = () => {
    return (
        <div role="status" aria-label="載入中" className="flex justify-center py-16">
            <div className="border-accent/20 border-t-accent h-10 w-10 animate-spin rounded-full border-4 motion-reduce:animate-none" />
        </div>
    );
};
