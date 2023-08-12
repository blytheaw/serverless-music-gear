import { z } from "zod";
import { Rental } from "../../providers/rental.js";
import { ApiHandler } from "../api-handler.js";
import {
  CreateRentalSchema,
  UpdateRentalSchema,
} from "../../schemas/rental.js";

const rentalIdPathSchema = z.object({
  id: z.string().uuid(),
});

export const create = ApiHandler(
  z.object({ body: CreateRentalSchema }),
  async (request) => {
    return await Rental.create(request.body);
  }
);

export const list = ApiHandler(z.any(), async () => {
  return await Rental.list();
});

export const get = ApiHandler(
  z.object({
    pathParameters: rentalIdPathSchema,
  }),
  async (request) => {
    return await Rental.fromId(request.pathParameters.id);
  }
);

export const update = ApiHandler(
  z.object({
    pathParameters: rentalIdPathSchema,
    body: UpdateRentalSchema,
  }),
  async (request) => {
    return await Rental.update(request.pathParameters.id, request.body);
  }
);

export const remove = ApiHandler(
  z.object({
    pathParameters: rentalIdPathSchema,
  }),
  async (request) => {
    await Rental.remove(request.pathParameters.id);
  }
);
