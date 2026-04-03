import { reslyRequest } from "../lib/resly-client.js";

export async function createGuestCharge(payload) {
  return reslyRequest("POST", "/guest-charges", { body: payload });
}
