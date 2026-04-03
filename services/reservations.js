import { success, failure } from '../lib/tool-result.js'
import { reslyRequest } from "../lib/resly-client.js";

export async function listReservations(args = {}) {
  return success(reslyRequest("GET", "/reservations", { query: args }));
}

export async function getReservationById({ reservationId }) {
  return success(reslyRequest("GET", `/reservations/${reservationId}`));
}

export async function createReservation(payload) {
  return success(reslyRequest("POST", "/reservations", { body: payload }));
}

