import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { APIGatewayProxyHandler } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';
import { Server } from 'http';

import { ApiModule } from './api.module';

let cachedServer: Server

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express()
  const adapter = new ExpressAdapter(expressApp)
  const app = await NestFactory.create(ApiModule, adapter)
  app.enableCors()
  await app.init()
  return awsServerlessExpress.createServer(expressApp)
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedServer) {
    const server = await bootstrapServer()
    cachedServer = server
    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise
  } else {
    return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE').promise
  }
}
