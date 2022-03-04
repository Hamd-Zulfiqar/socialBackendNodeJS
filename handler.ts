import app from "./src/app";
//import * as ASE from "aws-serverless-express";
import serverless from "serverless-http";
import { APIGatewayProxyHandler } from "aws-lambda";

//const server = ASE.createServer(app);

// export const handler = (
//   event: lambda.APIGatewayProxyEvent,
//   context: lambda.Context
// ) => {
//   return ASE.proxy(server, event, context);
// };

export const api = serverless(app);
