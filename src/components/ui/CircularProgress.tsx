import React from "react";

export const CircularProgress = () => {
    return (
        <div role="status" aria-label="載入中" className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent/20 border-t-accent motion-reduce:animate-none" />
        </div>
    );
};
