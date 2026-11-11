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

export type ClientLineItem = {id: string; description: string; qty: string; unit_price: string; amount: string; position: number};

export type ClientSection = {id: string; title: string; position: number; line_items: ClientLineItem[]};

// 報價單：只回傳「客人可見」嘅報價。
export type ClientQuote = {
    id: string;
    reference_no: string;
    customer_name: string;
    contact_person: string | null;
    customer_phone: string | null;
    subtotal: string;
    discount: string;
    total: string;
    notes: string | null;
    terms: string | null; // rich text HTML；null 即用默認條款
    sections: ClientSection[];
};

// 發票：獨立資源，有自己嘅分類同細項；只回傳「客人可見」嘅發票。
export type ClientInvoice = {
    id: string;
    invoice_no: string;
    quote_reference_no: string | null; // 選填：來源報價編號
    customer_name: string;
    contact_person: string | null;
    customer_phone: string | null;
    subtotal: string;
    discount: string;
    total: string;
    due_date: string; // YYYY-MM-DD
    notes: string | null;
    payment_details: string | null; // rich text HTML；null 即用默認付款詳情
    sections: ClientSection[];
};
