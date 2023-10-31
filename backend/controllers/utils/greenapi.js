import whatsAppClient from "@green-api/whatsapp-api-client";

export const restAPI = whatsAppClient.restAPI({
  idInstance: process.env.ID_INSTANCE,
  apiTokenInstance: process.env.API_TOKEN_INSTANCE,
});