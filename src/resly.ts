const BASE_URL = process.env.RESLY_BASE_URL!;
const ACCOUNT_ID = process.env.RESLY_ACCOUNT_ID!;
const API_KEY = process.env.RESLY_API_KEY!;

let token: string | null = null;
let expires = 0;

async function getToken() {
  const now = Date.now();
  if (token && now < expires - 60000) return token;

  const res = await fetch(`${BASE_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountId: ACCOUNT_ID, key: API_KEY })
  });

  const data = await res.json();
  token = data.token;
  expires = now + data.expires_in * 1000;

  return token;
}

export async function getAvailability(check_in: string, check_out: string) {
  const t = await getToken();

  const res = await fetch(
    `${BASE_URL}/express/direct/availability?arrivalDate=${check_in}&departureDate=${check_out}`,
    {
      headers: {
        Authorization: `Bearer ${t}`
      }
    }
  );

  return res.json();
}
