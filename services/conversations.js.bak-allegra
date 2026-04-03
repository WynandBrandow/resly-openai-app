import { reslyRequest } from "../lib/resly-client.js";

export async function listConversations(args = {}) {
  return reslyRequest("GET", "/conversations", { query: args });
}
