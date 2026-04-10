import {
  getAccessToken,
  refreshAccessToken,
  clearTokens,
} from "./auth";

const API_URL = "http://caua.flashnetbrasil.com.br/api/v1";

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch(
  endpoint: string,
  options: ApiOptions = {}
): Promise<Response> {
  const { auth = true, headers, ...rest } = options;

  const requestHeaders = new Headers(headers || {});
  const token = getAccessToken();

  if (auth && token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const makeRequest = () =>
    fetch(`${API_URL}${endpoint}`, {
      ...rest,
      headers: requestHeaders,
    });

  let response = await makeRequest();

  if (response.status === 401 && auth) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      clearTokens();
      window.location.href = "/login";
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    requestHeaders.set("Authorization", `Bearer ${newToken}`);
    response = await makeRequest();
  }

  return response;
}