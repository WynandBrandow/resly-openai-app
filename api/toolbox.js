import { listReservations, getReservationById, createReservation } from "../services/reservations.js";
import { listMessages, createMessage } from "../services/messages.js";
import { createGuestCharge } from "../services/guest-charges.js";
import { listConversations } from "../services/conversations.js";

const operations = {
  reservations_list: {
    label: "Reservations · List",
    run: async (payload = {}) => listReservations(payload)
  },
  reservation_get: {
    label: "Reservation · Get",
    run: async (payload = {}) => {
      if (!payload.reservationId) throw new Error("reservationId is required");
      return getReservationById(payload);
    }
  },
  reservation_create: {
    label: "Reservation · Create",
    run: async (payload = {}) => createReservation(payload)
  },
  messages_list: {
    label: "Messages · List",
    run: async (payload = {}) => listMessages(payload)
  },
  message_create: {
    label: "Message · Create",
    run: async (payload = {}) => createMessage(payload)
  },
  guest_charge_create: {
    label: "Guest Charge · Create",
    run: async (payload = {}) => createGuestCharge(payload)
  },
  conversations_list: {
    label: "Conversations · List",
    run: async (payload = {}) => listConversations(payload)
  }
};

function send(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.status(status).send(JSON.stringify(body, null, 2));
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    return send(res, 200, {
      ok: true,
      service: "allegra-connect-ui-toolbox",
      operations: Object.entries(operations).map(([key, value]) => ({
        key,
        label: value.label
      }))
    });
  }

  if (req.method !== "POST") {
    return send(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const { operation, payload } = req.body || {};
    const entry = operations[operation];

    if (!entry) {
      return send(res, 400, {
        ok: false,
        error: "Unknown operation",
        operation
      });
    }

    const result = await entry.run(payload || {});

    return send(res, 200, {
      ok: true,
      operation,
      label: entry.label,
      result
    });
  } catch (error) {
    return send(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
