export const AUTH_KEY = "admin_authenticated";
export const ADMIN_TOKEN_KEY = "admin_token";
export const ADMIN_USERNAME_KEY = "admin_username";
export const ADMIN_ROLE_KEY = "admin_role";

type JwtPayload = {
  exp?: number;
  sub?: string;
  role?: string;
};

let logoutTimer: number | null = null;

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminAuth() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USERNAME_KEY);
  localStorage.removeItem(ADMIN_ROLE_KEY);
}

export function logoutAdmin() {
  clearAdminAuth();

  if (logoutTimer !== null) {
    window.clearTimeout(logoutTimer);
    logoutTimer = null;
  }
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;

    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isAdminTokenExpired(token?: string | null) {
  if (!token) return true;

  const payload = parseJwt(token);
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

export function removeExpiredAdminAuth() {
  const token = getAdminToken();
  console.log("startup token:", token);

  if (!token || isAdminTokenExpired(token)) {
    console.log("token missing or expired, clearing auth");
    logoutAdmin();
    return true;
  }

  console.log("token still valid");
  return false;
}

export function scheduleAdminAutoLogout(onExpire?: () => void) {
  const token = getAdminToken();

  if (logoutTimer !== null) {
    window.clearTimeout(logoutTimer);
    logoutTimer = null;
  }

  if (!token) return;

  const payload = parseJwt(token);

  if (!payload?.exp) {
    logoutAdmin();
    onExpire?.();
    return;
  }

  const delay = payload.exp * 1000 - Date.now();

  if (delay <= 0) {
    logoutAdmin();
    onExpire?.();
    return;
  }

  logoutTimer = window.setTimeout(() => {
    logoutAdmin();
    onExpire?.();
  }, delay);
}