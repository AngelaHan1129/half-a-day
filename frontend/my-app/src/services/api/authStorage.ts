export const AUTH_KEY = "admin_authenticated";
export const ADMIN_TOKEN_KEY = "admin_token";
export const ADMIN_USERNAME_KEY = "admin_username";
export const ADMIN_ROLE_KEY = "admin_role";

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