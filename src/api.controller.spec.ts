import { Test } from '@nestjs/testing';

import { ApiController } from './api.controller';
import { ApiModule } from './api.module';
import { EventService } from './event';
import { TestEventService } from './event.test_service';
import { freshEventInfo, freshId } from './EventUtils';
import { KeyValueService } from './keyvalue';
import { TestKeyValueService } from './keyvalue.test_service';
import { ExperimentalEventInfo, PersonSymptomsEvent } from './schema';

describe('ApiControllerController', () => {
  let apiController: ApiController
  let eventService: EventService
  let keyValueService: KeyValueService

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [ApiModule],
    })
    .overrideProvider(EventService).useClass(TestEventService)
    .overrideProvider(KeyValueService).useClass(TestKeyValueService)
    .compile()

    apiController = testingModule.get<ApiController>(ApiController)
    eventService = testingModule.get<EventService>(EventService)
    keyValueService = testingModule.get<KeyValueService>(KeyValueService)
  })

  describe('api', () => {
    it('postPersonSymptoms', async () => {
      const personId = freshId('person')
      const pse = { eventInfo: freshEventInfo(), personId } as PersonSymptomsEvent
      const eei = { locale: 'en-US' } as ExperimentalEventInfo

      const publishSpy = jest.spyOn(eventService, 'publish').mockResolvedValue()

      const goodSymptomsEvent = { ...pse, ...eei, feverInCelsius: 37.0 }
      const goodNextSteps = await apiController.postPersonSymptoms(personId, goodSymptomsEvent)
      expect(goodNextSteps?.html).toMatch(/Go on with your life./)

      const badSymptomsEvent = { ...pse, ...eei, feverInCelsius: 38.0 }
      const badNextSteps = await apiController.postPersonSymptoms(personId, badSymptomsEvent)
      expect(badNextSteps?.html).toMatch(/Head to the nearest lab please!/)

      const czechBadSymptomsEvent = { ...pse, ...eei, feverInCelsius: 38.0, locale: 'cs-CZ' }
      const czechBadNextSteps = await apiController.postPersonSymptoms(personId, czechBadSymptomsEvent)
      expect(czechBadNextSteps?.html).toMatch(/Jděte prosím do nejbližší laboratoře!/)

      expect(publishSpy).toBeCalledTimes(3)
      expect(publishSpy)
          .toHaveBeenNthCalledWith(2, 'person_symptoms_event', expect.objectContaining({feverInCelsius: 38.0}))
    })
  })
})
