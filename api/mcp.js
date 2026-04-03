import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

// ---- Resly client ----
let token = null;
let expires = 0;

async function getToken() {
  const now = Date.now();
  if (token && now < expires - 60000) return token;

  const res = await fetch(`${process.env.RESLY_BASE_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accountId: process.env.RESLY_ACCOUNT_ID,
      key: process.env.RESLY_API_KEY
    })
  });

  const data = await res.json();

  if (!res.ok || !data.token) {
    throw new Error(data.message || "Auth failed");
  }

  token = data.token;
  expires = now + data.expires_in * 1000;

  return token;
}

async function resly(method, path, { query, body } = {}) {
  const t = await getToken();

  let url = process.env.RESLY_BASE_URL + path;

  if (query) {
    const params = new URLSearchParams(query);
    url += "?" + params.toString();
  }

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

function ok(data) {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    structuredContent: data
  };
}

function fail(e) {
  return {
    content: [{ type: "text", text: e.message }],
    isError: true
  };
}

// ---- MCP HANDLER ----
export default async function handler(req, res) {
  try {
    const server = new McpServer({
      name: "allegra-connect",
      version: "1.0.0"
    });

    // ---- RESERVATIONS ----
    server.registerTool(
      "reservations_list",
      {
        description: "List reservations",
        inputSchema: {
          arrivalDate: z.string().optional(),
          departureDate: z.string().optional(),
          guestName: z.string().optional()
        }
      },
      async (args) => {
        try {
          return ok(await resly("GET", "/reservations", { query: args }));
        } catch (e) {
          return fail(e);
        }
      }
    );

    server.registerTool(
      "reservation_get",
      {
        description: "Get reservation by ID",
        inputSchema: {
          reservationId: z.string()
        }
      },
      async ({ reservationId }) => {
        try {
          return ok(await resly("GET", `/reservations/${reservationId}`));
        } catch (e) {
          return fail(e);
        }
      }
    );

    // ---- MESSAGES ----
    server.registerTool(
      "messages_list",
      {
        description: "List messages",
        inputSchema: {
          reservationId: z.string().optional()
        }
      },
      async (args) => {
        try {
          return ok(await resly("GET", "/messages", { query: args }));
        } catch (e) {
          return fail(e);
        }
      }
    );

    server.registerTool(
      "message_create",
      {
        description: "Create message",
        inputSchema: {
          payload: z.any()
        }
      },
      async ({ payload }) => {
        try {
          return ok(await resly("POST", "/messages", { body: payload }));
        } catch (e) {
          return fail(e);
        }
      }
    );

    // ---- GUEST CHARGES ----
    server.registerTool(
      "guest_charge_create",
      {
        description: "Create guest charge",
        inputSchema: {
          payload: z.any()
        }
      },
      async ({ payload }) => {
        try {
          return ok(await resly("POST", "/guest-charges", { body: payload }));
        } catch (e) {
          return fail(e);
        }
      }
    );

    // ---- TRANSPORT ----
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);

  } catch (err) {
    res.status(500).json({
      error: err.message || "MCP failure"
    });
  }
}