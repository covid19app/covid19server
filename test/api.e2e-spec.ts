import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { ApiModule } from '../src/api.module';
import { EventService } from '../src/event';
import { freshEventInfo, freshId } from '../src/EventUtils';
import { KeyValueService } from '../src/keyvalue';
import { PersonProfileEvent, Sex } from '../src/schema';
import { TestEventService, TestKeyValueService } from '../src/test.service';

describe('ApiController (e2e)', () => {
  let app;
  let eventService: EventService
  let keyValueService: KeyValueService

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [ApiModule],
    })
    .overrideProvider(EventService).useClass(TestEventService)
    .overrideProvider(KeyValueService).useClass(TestKeyValueService)
    .compile()

    eventService = testingModule.get<EventService>(EventService)
    keyValueService = testingModule.get<KeyValueService>(KeyValueService)

    app = testingModule.createNestApplication()
    await app.init()
  })

  it('getPerson', async () => {
    const personId = freshId('person')

    const notRegisteredResponse = request(app.getHttpServer()).get(`/v1/person/${personId}`)
    await notRegisteredResponse.expect(200).expect('NOT_REGISTERED')

    const personProfileEvent: PersonProfileEvent = {
      eventInfo: freshEventInfo(),
      personId,
      name: 'John Doe',
      age: 42,
      sex: Sex.NON_BINARY,
      locale: 'en-US',
      deactivated: undefined,
    }
    await request(app.getHttpServer()).post(`/v1/person/${personId}/profile`).send(personProfileEvent).expect(201)

    const registeredResponse = request(app.getHttpServer()).get(`/v1/person/${personId}`)
    await registeredResponse.expect(200).expect('REGISTERED')
  })
})
