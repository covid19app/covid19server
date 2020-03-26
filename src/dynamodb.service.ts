import { Injectable } from '@nestjs/common';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';

@Injectable()
export class DynamoDbService {
  dynamoDb = new DynamoDB.DocumentClient()

  async get<T>(typeNameOfT: string, key: DynamoDB.DocumentClient.Key) {
    const params = {
      TableName: `${typeNameOfT}-${process.env.COVID19SERVER_STAGE}`,
      Key: key,
    }
    return await this.dynamoDb.get(params).promise().then(result => result.Item as T)
    }

  async put<T>(typeNameOfT: string, item: DynamoDB.DocumentClient.PutItemInputAttributeMap) {
    const params = {
      TableName: `${typeNameOfT}-${process.env.COVID19SERVER_STAGE}`,
      Item: { ...item, eventInfo: undefined }, // TODO: solve this cleanly
    }
    return await this.dynamoDb.put(params).promise()
  }
}
