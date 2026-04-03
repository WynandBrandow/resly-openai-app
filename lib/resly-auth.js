let token = null;
let expiresAtMs = 0;

export async function getAccessToken() {
  const now = Date.now();

  if (token && now < expiresAtMs - 60000) {
    return token;
  }

  const response = await fetch(`${process.env.RESLY_BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      accountId: process.env.RESLY_ACCOUNT_ID,
      key: process.env.RESLY_API_KEY
    })
  });

  const data = await response.json();

  if (!response.ok || !data?.token) {
    throw new Error(data?.message || "Failed to authenticate with Resly");
  }

  token = data.token;
  expiresAtMs = now + ((data.expires_in ?? 3600) * 1000);

  return token;
}
