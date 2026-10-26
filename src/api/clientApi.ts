import {API_ORIGIN} from "@/constants/api";
import type {ApiError, ApiResult} from "@/types/progress";

type Method = "GET" | "POST";

export function isApiError(value: unknown): value is ApiError {
    return typeof value === "object" && value !== null && "status" in value && "code" in value;
}

export function toApiError(value: unknown): ApiError {
    return isApiError(value) ? value : {status: 0, code: "network_error", message: "network error"};
}

function parseRetryAfter(value: string | null) {
    if (!value) return undefined;
    const seconds = Number(value);
    return Number.isFinite(seconds) && seconds >= 0 ? Math.ceil(seconds) : undefined;
}

// access code 只可以放喺 X-Access-Code header，error 亦唔可以帶 code
async function request<T>(method: Method, path: string, code: string, body?: unknown, signal?: AbortSignal): Promise<ApiResult<T>> {
    const headers: Record<string, string> = {Accept: "application/json", "X-Access-Code": code.trim()};
    if (body !== undefined) headers["Content-Type"] = "application/json";

    let res: Response;
    try {
        res = await fetch(`${API_ORIGIN}/api/v1/client${path}`, {method, headers, cache: "no-store", signal, body: body === undefined ? undefined : JSON.stringify(body)});
    } catch (error) {
        if (signal?.aborted) throw error;
        throw {status: 0, code: "network_error", message: "network error"} satisfies ApiError;
    }

    const json = await res.json().catch(() => null);

    if (!res.ok) {
        const source = json?.error ?? json;
        throw {
            status: res.status,
            code: typeof source?.code === "string" ? source.code : "http_error",
            message: typeof source?.message === "string" ? source.message : `HTTP ${res.status}`,
            details: source?.details,
            requestId: source?.request_id,
            retryAfter: parseRetryAfter(res.headers.get("Retry-After")),
        } satisfies ApiError;
    }

    return {data: json?.data as T, meta: json?.meta};
}

export function clientGet<T>(path: string, code: string, signal?: AbortSignal) {
    return request<T>("GET", path, code, undefined, signal);
}

export function clientPost<T>(path: string, code: string, body: unknown, signal?: AbortSignal) {
    return request<T>("POST", path, code, body, signal);
}
