export function setToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem("user_token", token);
}

export function getToken(): string | null {
  if (typeof window !== "undefined") return localStorage.getItem("user_token");
  return null;
}

export function removeToken() {
  if (typeof window !== "undefined") localStorage.removeItem("user_token");
}