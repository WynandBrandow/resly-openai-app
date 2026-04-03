import { reslyRequest } from "../lib/resly-client.js";

export async function listReservations(args = {}) {
  return reslyRequest("GET", "/reservations", { query: args });
}

export async function getReservationById({ reservationId }) {
  return reslyRequest("GET", `/reservations/${reservationId}`);
}

export async function createReservation(payload) {
  return reslyRequest("POST", "/reservations", { body: payload });
}
