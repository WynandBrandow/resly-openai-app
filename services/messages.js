import { reslyRequest } from "../lib/resly-client.js";

export const messages = {
  send: (body) => reslyRequest("POST", "/messages", { body })
};
