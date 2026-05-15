import { PATHS } from "../../app/router/paths";
import {
  getAdminToken,
  isAdminTokenExpired,
  logoutAdmin,
} from "./authStorage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

type RequestOptions = {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: HeadersInit;
  auth?: boolean;
};

function redirectToLogin() {
  window.location.href = PATHS.login;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    params,
    headers,
    auth = false,
  } = options;

  const url = new URL(`${BASE_URL}${path}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const finalHeaders = new Headers(headers);

  if (!finalHeaders.has("Accept")) {
    finalHeaders.set("Accept", "application/json");
  }

  if (body !== undefined && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
  const token = getAdminToken();

  if (!token || isAdminTokenExpired(token)) {
    logoutAdmin();
    redirectToLogin();
    throw new Error("登入已過期，請重新以管理者帳號登入。");
  }

  finalHeaders.set("Authorization", `Bearer ${token}`);
}

  const response = await fetch(url.toString(), {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if ((response.status === 401 || response.status === 403) && auth) {
    logoutAdmin();
    redirectToLogin();
    throw new Error("登入已過期或權限失效，請重新登入。");
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ""}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}