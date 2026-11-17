export const Skeleton = () => {
    return (
        <div aria-busy="true" role="status" className="animate-pulse motion-reduce:animate-none">
            <div className="bg-brand/10 mb-8 h-72 w-full rounded-lg md:h-96" />
            <div className="bg-brand/10 mb-3 h-8 w-1/3 rounded" />
            <div className="bg-brand/10 mb-8 h-4 w-1/4 rounded" />
            <div className="bg-brand/10 h-32 rounded-lg" />
        </div>
    );
};
