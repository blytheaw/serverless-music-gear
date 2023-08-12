import { z } from "zod";
import { Rental } from "../../providers/rental";
import { APIGatewayEvent } from "aws-lambda";
import { ApiHandler } from "../api-handler";
import { CreateRentalSchema } from "../../schemas/rental";

export const create = ApiHandler(CreateRentalSchema, async (event) => {
  await Rental.create(event);
});

export const list = ApiHandler(z.any(), async () => {
  return await Rental.list();
});

export const get = ApiHandler(
  z.object({
    pathParameters: z.object({
      id: z.string().uuid(),
    }),
  }),
  async (request) => {
    return await Rental.fromId(request.pathParameters.id);
  }
);

export const update = async (event) => {};

export const remove = ApiHandler(
  z.object({
    pathParameters: z.object({
      id: z.string().uuid(),
    }),
  }),
  async (request) => {
    await Rental.remove(request.pathParameters.id);
  }
);
