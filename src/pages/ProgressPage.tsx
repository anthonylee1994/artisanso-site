import React from "react";
import {AccessGate} from "@/components/progress/AccessGate";
import {CommentComposer} from "@/components/progress/CommentComposer";
import {CommentThread} from "@/components/progress/CommentThread";
import {MilestoneTimeline} from "@/components/progress/MilestoneTimeline";
import {ProgressLayout} from "@/components/progress/ProgressLayout";
import {ProgressPhotos} from "@/components/progress/ProgressPhotos";
import {ProjectSummary} from "@/components/progress/ProjectSummary";
import {useAccessCode} from "@/hooks/useAccessCode";
import {useClientComments} from "@/hooks/useClientComments";
import {useClientProject} from "@/hooks/useClientProject";

const Skeleton = () => {
    return (
        <div aria-busy="true" role="status" className="animate-pulse motion-reduce:animate-none">
            <div className="mb-4 aspect-4/3 w-full rounded-lg bg-brand/10" />
            <div className="mb-3 h-8 w-2/3 rounded bg-brand/10" />
            <div className="mb-8 h-4 w-1/3 rounded bg-brand/10" />
            <div className="h-32 rounded bg-brand/10" />
        </div>
    );
};

export const ProgressPage = () => {
    const access = useAccessCode();
    const [draft, setDraft] = React.useState("");
    const [scrollSignal, setScrollSignal] = React.useState(0);

    const project = useClientProject(access.code, access.reject);
    const comments = useClientComments(project.project ? access.code : null, access.reject);

    const refreshAll = () => {
        project.reload();
        comments.reload();
    };

    // 分頁重新可見時更新一次
    React.useEffect(() => {
        const onVisible = () => {
            if (document.visibilityState === "visible") refreshAll();
        };
        document.addEventListener("visibilitychange", onVisible);
        return () => document.removeEventListener("visibilitychange", onVisible);
    });

    const rateLimited = project.error?.status === 429;
    const showGate = access.phase === "needs_code" || (rateLimited && !project.project);

    const renderBody = () => {
        if (showGate) {
            return (
                <AccessGate
                    rejected={access.rejected}
                    retryAfter={rateLimited ? (project.error?.retryAfter ?? 60) : undefined}
                    onSubmit={value => {
                        access.submit(value);
                        project.reload();
                    }}
                />
            );
        }
        if (project.project) {
            return (
                <React.Fragment>
                    <ProjectSummary project={project.project} />
                    <MilestoneTimeline milestones={project.project.milestones} />
                    <ProgressPhotos project={project.project} />
                    <section id="progress-comments" aria-labelledby="comments-title" className="scroll-mt-20">
                        <h2 id="comments-title" className="mb-4 text-xl font-bold">
                            留言
                        </h2>
                        <CommentThread
                            comments={comments.comments}
                            truncated={comments.truncated}
                            loaded={comments.loaded}
                            failed={comments.failed}
                            scrollSignal={scrollSignal}
                            onRefresh={refreshAll}
                        />
                        <CommentComposer draft={draft} onDraftChange={setDraft} onSend={comments.send} onSent={() => setScrollSignal(n => n + 1)} />
                    </section>
                </React.Fragment>
            );
        }
        if (project.error) {
            return (
                <div role="alert" className="text-center">
                    <p className="mb-4">暫時未能載入，請稍後重試。</p>
                    <button type="button" onClick={project.reload} className="min-h-11 rounded bg-accent px-6 font-semibold text-white hover:bg-accent-dark">
                        重試
                    </button>
                </div>
            );
        }
        return <Skeleton />;
    };

    return <ProgressLayout>{renderBody()}</ProgressLayout>;
};
