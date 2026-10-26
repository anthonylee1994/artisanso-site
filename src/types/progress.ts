export type ClientMilestoneStatus = "pending" | "in_progress" | "done";

export type ClientMilestone = {
    id: string;
    title: string;
    status: ClientMilestoneStatus;
    position: number;
    due_on: string | null; // YYYY-MM-DD
    completed_on: string | null; // YYYY-MM-DD
    client_summary: string | null;
};

export type ClientPhoto = {
    id: string;
    url: string;
    role: "cover" | "gallery";
    position: number;
};

export type ClientProject = {
    title: string;
    slug: string;
    category: "home" | "office" | "village" | "factory";
    district: string | null;
    status: "lead" | "active";
    cover_photo: {id: string; url: string} | null;
    milestones: ClientMilestone[];
    photos: ClientPhoto[];
};

export type ClientComment = {
    id: string;
    author_role: "client" | "staff";
    author_name: string;
    body: string;
    created_at: string; // ISO 8601 UTC
};

export type ApiError = {
    status: number;
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
    retryAfter?: number;
};

export type ApiMeta = {
    page?: number;
    per_page?: number;
    total_pages?: number;
    total_count?: number;
};

export type ApiResult<T> = {
    data: T;
    meta?: ApiMeta;
};
