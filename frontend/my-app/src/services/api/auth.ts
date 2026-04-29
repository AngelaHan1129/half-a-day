const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";

const AUTH_KEY = "admin_authenticated";

type LoginResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  username?: string;
};

export const loginApi = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username,
      password,
    }),
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

  if (data?.username) {
    localStorage.setItem("admin_username", data.username);
  }

  if (data?.token) {
    localStorage.setItem("admin_token", data.token);
  }

  return data;
};

export const logoutApi = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_token");
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_KEY) === "true";
};