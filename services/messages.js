import { success, failure } from '../lib/tool-result.js'
import { reslyRequest } from "../lib/resly-client.js";

export async function listMessages(args = {}) {
  return success(reslyRequest("GET", "/messages", { query: args }));
}

export async function createMessage(payload) {
  return success(reslyRequest("POST", "/messages", { body: payload }));
}

