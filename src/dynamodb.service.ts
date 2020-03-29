import { Injectable } from '@nestjs/common';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';

import { KeyValueService } from './keyvalue';

@Injectable()
export class DynamoDbService extends KeyValueService {
  private dynamoDb = new DynamoDB.DocumentClient()

  async get<T>(typeNameOfT: string, key: string): Promise<T> {
    const params = {
      TableName: `${typeNameOfT}-${process.env.COVID19SERVER_STAGE}`,
      Key: {key},
    }
    const result = await this.dynamoDb.get(params).promise()
    return result.Item as T
  }

  async put<T>(typeNameOfT: string, key: string, value: T): Promise<void> {
    const params = {
      TableName: `${typeNameOfT}-${process.env.COVID19SERVER_STAGE}`,
      Item: { key, ...value, eventInfo: undefined },
    }
    await this.dynamoDb.put(params).promise()
  }
}
