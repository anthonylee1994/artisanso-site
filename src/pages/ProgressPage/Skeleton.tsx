export const Skeleton = () => {
    return (
        <div aria-busy="true" role="status" className="animate-pulse motion-reduce:animate-none">
            <div className="mb-4 aspect-4/3 w-full rounded-lg bg-brand/10" />
            <div className="mb-3 h-8 w-2/3 rounded bg-brand/10" />
            <div className="mb-8 h-4 w-1/3 rounded bg-brand/10" />
            <div className="h-32 rounded bg-brand/10" />
        </div>
    );
};
