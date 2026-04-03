import { getAccessToken } from "./resly-auth.js";

function buildUrl(path, query) {
  const url = new URL(`${process.env.RESLY_BASE_URL}${path}`);

  if (query && typeof query === "object") {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

export async function reslyRequest(method, path, { query, body } = {}) {
  const token = await getAccessToken();

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || JSON.stringify(data);
    throw new Error(message);
  }

  return data;
}
