import { reslyRequest } from "../lib/resly-client.js";

export const reservations = {
  list: (query) => reslyRequest("GET", "/reservations", { query }),
  get: (id) => reslyRequest("GET", `/reservations/${id}`)
};
