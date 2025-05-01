import Medusa from "@medusajs/js-sdk";

export const sdk = new Medusa({
  baseUrl: "/",
  debug: true,
  auth: {
    type: "session",
  },
});
