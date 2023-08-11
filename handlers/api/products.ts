import { ZodError, z } from "zod";
import { Product } from "../../providers/product";
import { APIGatewayEvent } from "aws-lambda";

const productPathSchema = z.object({
  pathParameters: z.object({
    id: z.string().uuid(),
  }),
});

export const create = async (event: APIGatewayEvent) => {};

export const list = async (event: APIGatewayEvent) => {};

export const get = async (event: APIGatewayEvent) => {
  try {
    const request = productPathSchema.parse(event);

    return await Product.fromId(request.pathParameters.id);
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

export const update = async (event) => {};

export const remove = async (event) => {};
