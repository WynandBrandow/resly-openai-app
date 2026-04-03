import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

import { ok, fail } from "../lib/tool-result.js";
import {
  listReservations,
  getReservationById,
  createReservation
} from "../services/reservations.js";
import { listMessages, createMessage } from "../services/messages.js";
import { createGuestCharge } from "../services/guest-charges.js";
import { listConversations } from "../services/conversations.js";

function buildServer() {
  const server = new McpServer({
    name: "allegra-connect",
    version: "1.0.0"
  });

  server.registerTool(
    "reservations_list",
    {
      title: "List reservations",
      description: "List reservations in Resly with optional filters.",
      inputSchema: {
        arrivalDate: z.string().optional(),
        departureDate: z.string().optional(),
        reservationId: z.string().optional(),
        guestName: z.string().optional(),
        status: z.string().optional(),
        limit: z.number().optional()
      }
    },
    async (args) => {
      try {
        return ok(await listReservations(args));
      } catch (error) {
        return fail(error);
      }
    }
  );

  server.registerTool(
    "reservation_get",
    {
      title: "Get reservation",
      description: "Get a specific reservation by its reservation ID.",
      inputSchema: {
        reservationId: z.string()
      }
    },
    async (args) => {
      try {
        return ok(await getReservationById(args));
      } catch (error) {
        return fail(error);
      }
    }
  );

  server.registerTool(
    "reservation_create",
    {
      title: "Create reservation",
      description: "Create a reservation in Resly.",
      inputSchema: {
        payload: z.any()
      }
    },
    async ({ payload }) => {
      try {
        return ok(await createReservation(payload));
      } catch (error) {
        return fail(error);
      }
    }
  );

  server.registerTool(
    "messages_list",
    {
      title: "List messages",
      description: "List guest messages in Resly.",
      inputSchema: {
        reservationId: z.string().optional(),
        conversationId: z.string().optional(),
        guestName: z.string().optional()
      }
    },
    async (args) => {
      try {
        return ok(await listMessages(args));
      } catch (error) {
        return fail(error);
      }
    }
  );

  server.registerTool(
    "message_create",
    {
      title: "Create message",
      description: "Create or send a guest message in Resly.",
      inputSchema: {
        payload: z.any()
      }
    },
    async ({ payload }) => {
      try {
        return ok(await createMessage(payload));
      } catch (error) {
        return fail(error);
      }
    }
  );

  server.registerTool(
    "guest_charge_create",
    {
      title: "Create guest charge",
      description: "Create a guest charge in Resly.",
      inputSchema: {
        payload: z.any()
      }
    },
    async ({ payload }) => {
      try {
        return ok(await createGuestCharge(payload));
      } catch (error) {
        return fail(error);
      }
    }
  );

  server.registerTool(
    "conversations_list",
    {
      title: "List conversations",
      description: "List conversations in Resly.",
      inputSchema: {
        reservationId: z.string().optional(),
        guestName: z.string().optional()
      }
    },
    async (args) => {
      try {
        return ok(await listConversations(args));
      } catch (error) {
        return fail(error);
      }
    }
  );

  return server;
}

export default async function handler(req, res) {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true
    });

    const server = buildServer();
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    res.status(500).json(
      fail(error)
    );
  }
}
