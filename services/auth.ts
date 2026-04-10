const API_URL = "http://caua.flashnetbrasil.com.br/api/v1";

export function getAccessToken() {
  return localStorage.getItem("token");
}

export function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

export function saveTokens(accessToken: string, refreshToken?: string) {
  localStorage.setItem("token", accessToken);
  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }
}

export function clearTokens() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token_expires_in");
  localStorage.removeItem("user");
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    saveTokens(data.access_token);

    if (data.expires_in) {
      localStorage.setItem("token_expires_in", String(data.expires_in));
    }

    return data.access_token;
  } catch {
    clearTokens();
    return null;
  }
}