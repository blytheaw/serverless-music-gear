import { captureLambdaHandler } from "@aws-lambda-powertools/tracer";
import middy from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import { z, ZodError, ZodSchema } from "zod";
import { logger, metrics, tracer } from "../common/utils";
import { ResourceNotFoundError } from "../models/errors/resource-not-found-error";
import { injectLambdaContext } from "@aws-lambda-powertools/logger";
import { logMetrics } from "@aws-lambda-powertools/metrics";

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
        logger.error("Unhandled error", error as Error);
        return {
          statusCode: 500,
          body: "Unexpected error",
        };
      }
    }
  )
    .use(captureLambdaHandler(tracer))
    .use(injectLambdaContext(logger, { clearState: true }))
    .use(logMetrics(metrics, { captureColdStartMetric: true }));
}
