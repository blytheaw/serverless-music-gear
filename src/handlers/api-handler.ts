import { captureLambdaHandler } from "@aws-lambda-powertools/tracer";
import middy from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import { z, ZodError, ZodSchema } from "zod";
import { tracer } from "../common/utils";
import { ResourceNotFoundError } from "../models/errors/resource-not-found-error";

export function ApiHandler<T extends ZodSchema, R>(
  schema: T,
  fn: (event: z.infer<T>) => Promise<R>
): Handler {
  return middy(
    async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
      try {
        event.body = JSON.parse(event.body ?? "{}");
        const res = await fn(schema.parse(event));
        return {
          statusCode: res === undefined ? 204 : 200,
          body: JSON.stringify(res),
        };
      } catch (error) {
        if (error instanceof ZodError) {
          return {
            statusCode: 400,
            body: "Bad Request",
          };
        }
        if (error instanceof ResourceNotFoundError) {
          return {
            statusCode: 404,
            body: "Not found",
          };
        }
        return {
          statusCode: 500,
          body: "Unexpected error",
        };
      }
    }
  ).use(captureLambdaHandler(tracer));
}
