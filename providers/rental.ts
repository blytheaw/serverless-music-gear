import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import * as uuid from "uuid";

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION })
);

export * as Rental from "./rental";

export async function create() {
  await ddb.send(
    new PutCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: uuid.v1(),
      },
    })
  );
}

export async function list() {
  const results = await ddb.send(
    new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE,
    })
  );

  return results.Items;
}

export async function fromId(id: string) {
  const result = await ddb.send(
    new GetCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id,
      },
    })
  );

  return result.Item;
}
