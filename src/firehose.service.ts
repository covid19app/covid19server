import { Injectable } from '@nestjs/common';
import * as Firehose from 'aws-sdk/clients/firehose';

@Injectable()
export class FirehoseService {
  private firehose = new Firehose()

  async publish(streamName: string, record: any) {
    const params = {
      DeliveryStreamName: streamName,
      Record: {
        Data: JSON.stringify(record),
      },
    }
    await this.firehose.putRecord(params).promise().catch(error => {
      console.error(`Unable to publish event to '${streamName}': ${JSON.stringify(error)}`)
      throw error
    })
  }
}
