import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommandOutput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import * as uuid from "uuid";
import { CreateRental, UpdateRental } from "../schemas/rental";
import { tracer } from "../common/utils";
import { RentalData } from "../models/data/rental";

const ddb = DynamoDBDocumentClient.from(
  tracer.captureAWSv3Client(
    new DynamoDBClient({ region: process.env.AWS_REGION })
  )
);

export * as Rental from "./rental";

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
      UpdateExpression: "SET status = :s, description = :d",
      ExpressionAttributeValues: {
        s: rental.status,
        d: rental.description,
      },
    })
  );
}

export async function list() {
  const rentalList: RentalData[] = [];

  let queryResults: ScanCommandOutput;
  let startKey: Record<string, any>;
  do {
    queryResults = await ddb.send(
      new ScanCommand({
        TableName: process.env.DYNAMODB_TABLE,
        ExclusiveStartKey: startKey,
      })
    );

    queryResults.Items.map((i) => rentalList.push(i as RentalData));
    startKey = queryResults.LastEvaluatedKey;
  } while (queryResults.LastEvaluatedKey);

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
