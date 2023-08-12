# Serverless Music Rentals

This sample application demonstrates a basic CRUD REST API using NodeJS, TypeScript, and Serverless Framework

This project used [this template](https://github.com/serverless/examples/tree/v3/aws-node-rest-api-with-dynamodb) from the Serverless Framework examples as a starting point

## Setup

This project uses NodeJS 18. Install it first, then install dependencies with `npm install`

## Usage

You can create, retrieve, update, or delete instrument rentals with the following commands:

### Create a new rental listing

POST /rentals

```json
{
  "name": "instrument name",
  "description": "instrument description",
  "type": "guitar"
}
```

### List all rentals

GET /rentals

### Get one rental by ID

GET /rentals/{id}

### Update a rental to rent or return it

PUT /rentals/{id}

```json
{
  "status": "rented"
}
```

### Delete a rental from the listings

DELETE /rentals/{id}

## Deployment

Prerequisite: make sure your AWS credentials are configured locally

- Deploy to dev stage with `npm run deploy:dev`
- Deploy to prod stage with `npm run deploy:prod`
- Deploy to an alternate stage with `npx sls deploy -s <stage>`
