import {
  AUTH_KEY,
  ADMIN_ROLE_KEY,
  ADMIN_TOKEN_KEY,
  ADMIN_USERNAME_KEY,
} from "./authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

type LoginResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  username?: string;
  role?: string;
};

export const loginApi = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  let data: LoginResponse | null = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "帳號或密碼錯誤");
  }

  localStorage.setItem(AUTH_KEY, "true");
  if (data?.username) localStorage.setItem(ADMIN_USERNAME_KEY, data.username);
  if (data?.token) localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
  if (data?.role) localStorage.setItem(ADMIN_ROLE_KEY, data.role);

  return data;
};

export const logoutApi = async () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(ADMIN_USERNAME_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_ROLE_KEY);
};

export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_KEY) === "true";
};