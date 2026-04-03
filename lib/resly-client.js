import { getAccessToken } from "./resly-auth.js";

export async function reslyRequest(method, path, { query, body } = {}) {
  const token = await getAccessToken();

  let url = process.env.RESLY_BASE_URL + path;

  if (query) {
    const params = new URLSearchParams(query);
    url += "?" + params.toString();
  }

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}
