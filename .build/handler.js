"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const app_1 = __importDefault(require("./src/app"));
//import * as ASE from "aws-serverless-express";
const serverless_http_1 = __importDefault(require("serverless-http"));
//const server = ASE.createServer(app);
// export const handler = (
//   event: lambda.APIGatewayProxyEvent,
//   context: lambda.Context
// ) => {
//   return ASE.proxy(server, event, context);
// };
exports.api = (0, serverless_http_1.default)(app_1.default);
