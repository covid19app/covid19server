import { Controller, Get, Param } from '@nestjs/common';
import { FirehoseService } from './firehose.service';

interface FirehoseTestEvent {
  key: string
  value: string
  timestamp: Date
}

@Controller('/v1/firehosetest')
export class FirehoseTestController {
  constructor(
    private readonly firehoseService: FirehoseService,
    ) {}

  @Get('/:value')
  async getFirehoseTest(@Param('value') value: string): Promise<string> {
    const key = `key-${Date.now()}`
    const event: FirehoseTestEvent = {key, value, timestamp: new Date()}
    await this.firehoseService.publish('firehosetest', event)
    return key
  }
}
