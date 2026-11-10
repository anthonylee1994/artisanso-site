import React from "react";
import {AccessGate} from "@/components/progress/AccessGate";
import {CommentComposer} from "@/components/progress/CommentComposer";
import {CommentThread} from "@/components/progress/CommentThread";
import {MilestoneTimeline} from "@/components/progress/MilestoneTimeline";
import {ProgressLayout} from "@/components/progress/ProgressLayout";
import {ProgressTabs, panelId, tabId} from "@/components/progress/ProgressTabs";
import {ProgressPhotos} from "@/components/progress/ProgressPhotos";
import {ProgressDocuments} from "@/components/progress/ProgressDocuments";
import {ProjectSummary} from "@/components/progress/ProjectSummary";
import {SectionHeading} from "@/components/progress/SectionHeading";
import {useAccessCode} from "@/hooks/useAccessCode";
import {useClientComments} from "@/hooks/useClientComments";
import {useClientInvoices} from "@/hooks/useClientInvoices";
import {useClientProject} from "@/hooks/useClientProject";
import {useClientQuotes} from "@/hooks/useClientQuotes";
import {Skeleton} from "./Skeleton";

export const ProgressPage = () => {
    const access = useAccessCode();
    const [draft, setDraft] = React.useState("");
    const [scrollSignal, setScrollSignal] = React.useState(0);
    const [tab, setTab] = React.useState("milestones");

    const project = useClientProject(access.code, access.reject);
    const comments = useClientComments(project.project ? access.code : null, access.reject);
    const quotes = useClientQuotes(project.project ? access.code : null, access.reject);
    const invoices = useClientInvoices(project.project ? access.code : null, access.reject);

    const refreshAll = () => {
        project.reload();
        comments.reload();
        quotes.reload();
        invoices.reload();
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
            const tabs = [
                {id: "milestones", label: "進度"},
                ...(project.project.photos.length > 0 ? [{id: "photos", label: "相片"}] : []),
                ...(quotes.quotes.length + invoices.invoices.length > 0 ? [{id: "documents", label: "文件"}] : []),
                {id: "comments", label: "留言"},
            ];
            const active = tabs.some(t => t.id === tab) ? tab : "milestones";

            return (
                <React.Fragment>
                    <ProjectSummary project={project.project} />
                    <ProgressTabs tabs={tabs} active={active} onChange={setTab} />
                    <div
                        role="tabpanel"
                        id={panelId(active)}
                        aria-labelledby={tabId(active)}
                        tabIndex={0}
                        className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                        {active === "milestones" && <MilestoneTimeline milestones={project.project.milestones} />}
                        {active === "photos" && <ProgressPhotos project={project.project} />}
                        {active === "documents" && <ProgressDocuments quotes={quotes.quotes} invoices={invoices.invoices} />}
                        {active === "comments" && (
                            <section id="progress-comments" aria-labelledby="comments-title">
                                <SectionHeading id="comments-title" eyebrow="Messages" title="留言" />
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
                        )}
                    </div>
                </React.Fragment>
            );
        }
        if (project.error) {
            return (
                <div role="alert" className="text-center">
                    <p className="mb-4">暫時未能載入，請稍後重試。</p>
                    <button type="button" onClick={project.reload} className="min-h-11 rounded-md bg-accent px-6 font-semibold text-white hover:bg-accent-dark">
                        重試
                    </button>
                </div>
            );
        }
        return <Skeleton />;
    };

    return <ProgressLayout>{renderBody()}</ProgressLayout>;
};
