const BASE_URL = process.env.RESLY_BASE_URL;
const ACCOUNT_ID = process.env.RESLY_ACCOUNT_ID;
const API_KEY = process.env.RESLY_API_KEY;

let token = null;
let expires = 0;

async function getToken() {
  const now = Date.now();
  if (token && now < expires - 60000) return token;

  const res = await fetch(`${BASE_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accountId: ACCOUNT_ID,
      key: API_KEY
    })
  });

  const data = await res.json();

  if (!res.ok || !data.token) {
    throw new Error(data.message || "Failed to get Resly token");
  }

  token = data.token;
  expires = now + ((data.expires_in ?? 3600) * 1000);

  return token;
}

export async function getAvailability(check_in, check_out) {
  const t = await getToken();

  const res = await fetch(
    `${BASE_URL}/express/direct/availability?arrivalDate=${check_in}&departureDate=${check_out}`,
    {
      headers: {
        Authorization: `Bearer ${t}`
      }
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Availability request failed");
  }

  return data;
}