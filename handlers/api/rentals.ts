import { ZodError, z } from "zod";
import { Rental } from "../../providers/rental";
import { APIGatewayEvent } from "aws-lambda";

const rentalIdPathSchema = z.object({
  pathParameters: z.object({
    id: z.string().uuid(),
  }),
});

export const create = async (event: APIGatewayEvent) => {};

export const list = async (event: APIGatewayEvent) => {};

export const get = async (event: APIGatewayEvent) => {
  try {
    const request = rentalIdPathSchema.parse(event);

    return await Rental.fromId(request.pathParameters.id);
  } catch (e) {
    if (e instanceof ZodError) {
      return {
        statusCode: 400,
      };
    } else {
      return {
        statusCode: 500,
      };
    }
  }
};

export const update = async (event: APIGatewayEvent) => {};

export const remove = async (event: APIGatewayEvent) => {};
