// VITE_API_BASE_URL 係 API origin（唔包 /api/v1）
export const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
