let token = null;
let expires = 0;

export async function getAccessToken() {
  const now = Date.now();
  if (token && now < expires - 60000) return token;

  const res = await fetch(process.env.RESLY_BASE_URL + "/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accountId: process.env.RESLY_ACCOUNT_ID,
      key: process.env.RESLY_API_KEY
    })
  });

  const data = await res.json();

  token = data.token;
  expires = now + data.expires_in * 1000;

  return token;
}
