import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  ScanCommandOutput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import * as uuid from "uuid";
import { CreateRental, UpdateRental } from "../schemas/rental.js";
import { tracer } from "../common/utils.js";
import { RentalData } from "../models/data/rental.js";

const ddb = DynamoDBDocumentClient.from(
  tracer.captureAWSv3Client(
    new DynamoDBClient({ region: process.env.AWS_REGION })
  ),
  {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  }
);

export * as Rental from "./rental.js";

export async function create(rental: CreateRental) {
  const id = uuid.v1();

  await ddb.send(
    new PutCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id,
        status: "available",
        ...rental,
      },
    })
  );

  return {
    id,
  };
}

export async function update(id: string, rental: UpdateRental) {
  await ddb.send(
    new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id,
      },
      UpdateExpression: "SET #st = :s",
      ExpressionAttributeNames: {
        "#st": "status",
      },
      ExpressionAttributeValues: {
        ":s": rental.status,
      },
    })
  );
}

export async function list() {
  const rentalList: RentalData[] = [];

  let scanResults: ScanCommandOutput;
  let startKey: Record<string, any> | undefined;
  do {
    scanResults = await ddb.send(
      new ScanCommand({
        TableName: process.env.DYNAMODB_TABLE,
        ExclusiveStartKey: startKey,
      })
    );

    scanResults?.Items?.map((i) => rentalList.push(i as RentalData));
    startKey = scanResults.LastEvaluatedKey;
  } while (scanResults.LastEvaluatedKey);

  return rentalList;
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

export async function remove(id: string) {
  await ddb.send(
    new DeleteCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id,
      },
    })
  );
}
