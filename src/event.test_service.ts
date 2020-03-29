import { Injectable } from '@nestjs/common';

import { EventService } from './event';

export interface Record {
  streamName: string
  event: any
}

@Injectable()
export class TestEventService extends EventService {
  records: Record[] = []

  async publish(streamName: string, event: any): Promise<void> {
    console.log(`EventTestService.publish({${streamName}, ${JSON.stringify(event)}})`)
    this.records.push({streamName, event})
  }
}
