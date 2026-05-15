import {
  AUTH_KEY,
  ADMIN_ROLE_KEY,
  ADMIN_USERNAME_KEY,
  logoutAdmin,
  setAdminToken,
  scheduleAdminAutoLogout,
} from "./authStorage";
import { PATHS } from "../../app/router/paths";

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
  if (data?.token) setAdminToken(data.token);
  if (data?.role) localStorage.setItem(ADMIN_ROLE_KEY, data.role);

  scheduleAdminAutoLogout(() => {
    window.location.href = PATHS.login;
  });

  return data;
};

export const logoutApi = async () => {
  logoutAdmin();
};

export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_KEY) === "true";
};