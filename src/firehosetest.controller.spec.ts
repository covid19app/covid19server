import { Test } from '@nestjs/testing';
import { FirehoseService } from './firehose.service';
import { FirehoseTestController } from './firehosetest.controller';

describe('FirehoseTestController', () => {
  let firehoseTestController: FirehoseTestController

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      controllers: [FirehoseTestController],
      providers: [FirehoseService],
    }).compile()

    firehoseTestController = app.get(FirehoseTestController)
  })

  describe('root', () => {
    it('should publish events to firehosetest', async () => {
      // expect(await firehoseTestController.getFirehoseTest('foo')).toMatch('key-\d+')
    })
  })
})
