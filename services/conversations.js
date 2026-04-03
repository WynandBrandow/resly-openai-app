import { success, failure } from '../lib/tool-result.js'
import { reslyRequest } from "../lib/resly-client.js";

export async function listConversations(args = {}) {
  return success(reslyRequest("GET", "/conversations", { query: args }));
}

