export function setToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem("admin_csb_bf_token", token);
}

export function getToken(): string | null {
  if (typeof window !== "undefined") return localStorage.getItem("admin_csb_bf_token");
  return null;
}

export function removeToken() {
  if (typeof window !== "undefined") localStorage.removeItem("admin_csb_bf_token");
}