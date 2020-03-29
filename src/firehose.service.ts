import { Injectable } from '@nestjs/common';
import * as Firehose from 'aws-sdk/clients/firehose';

import { EventService } from './event';

@Injectable()
export class FirehoseService extends EventService {
  private firehose = new Firehose()

  async publish(streamName: string, record: any): Promise<void> {
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
