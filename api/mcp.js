import { reservations } from "../services/reservations.js";
import { availability } from "../services/availability.js";
import { messages } from "../services/messages.js";

export default async function handler(req, res) {
  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { action } = body;

    let result;

    switch (action) {
      case "reservations.list":
        result = await reservations.list(body.query);
        break;

      case "reservations.get":
        result = await reservations.get(body.id);
        break;

      case "availability":
        result = await availability.inventory(body.query);
        break;

      case "availability.rates":
        result = await availability.rates(body.query);
        break;

      case "message.send":
        result = await messages.send(body.body);
        break;

      default:
        throw new Error("Unknown action");
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
