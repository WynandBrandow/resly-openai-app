import { getAvailability } from "../src/resly";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { check_in, check_out } = req.body;

    const data = await getAvailability(check_in, check_out);

    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
