import { reslyRequest } from "../lib/resly-client.js";

export async function listMessages(args = {}) {
  return reslyRequest("GET", "/messages", { query: args });
}

export async function createMessage(payload) {
  return reslyRequest("POST", "/messages", { body: payload });
}
