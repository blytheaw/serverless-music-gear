import { z } from "zod";
import { Rental } from "../../providers/rental.js";
import { ApiHandler } from "../api-handler.js";
import {
  CreateRentalSchema,
  UpdateRentalSchema,
} from "../../schemas/rental.js";
import { metrics } from "../../common/utils.js";
import { MetricUnits } from "@aws-lambda-powertools/metrics";

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
    await Rental.update(request.pathParameters.id, request.body);

    // Use CloudWatch custom metrics for tracking key indicators
    if (request.body.status === "rented") {
      metrics.addMetric("RentalCount", MetricUnits.Count, 1);
    }
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
