import { reslyRequest } from "../lib/resly-client.js";

export const availability = {
  inventory: (query) =>
    reslyRequest("GET", "/express/direct/availability", { query }),

  rates: (query) =>
    reslyRequest("GET", "/express/direct/availability-and-rates", { query })
};
