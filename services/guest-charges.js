import { success, failure } from '../lib/tool-result.js'
import { reslyRequest } from "../lib/resly-client.js";

export async function createGuestCharge(payload) {
  return success(reslyRequest("POST", "/guest-charges", { body: payload }));
}

