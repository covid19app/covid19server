import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';

import { CountryService } from './country.service';
import { EventService } from './event';
import { KeyValueService } from './keyvalue';
import { NotificationService } from './notification.service';
import { DeviceEntity, DeviceNotificationEvent, ExperimentalEventInfo, LabResult, NextSteps,
  PersonEntity, PersonProfileEvent, PersonSymptomsEvent, PersonTravelHistoryEvent,
  RegistrationStatus, TestEntity, TestPairEvent, TestResultEvent } from './schema';

@Controller()
export class ApiController {
  constructor(
    private readonly countryService: CountryService,
    @Inject('EventService') private readonly eventService: EventService,
    @Inject('KeyValueService') private readonly keyValueService: KeyValueService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get('/v1/device/:deviceId')
  async getDevice(@Param('deviceId') deviceId: string): Promise<string> {
    const deviceEntity = await this.keyValueService.get<DeviceEntity>('device_entity', deviceId)
    const status = deviceEntity ? RegistrationStatus.REGISTERED : RegistrationStatus.NOT_REGISTERED
    return RegistrationStatus[status]
  }

  @Post('/v1/device/:deviceId/notification')
  async postDeviceNotification(@Param('deviceId') deviceId: string,
      @Body() deviceNotificationEvent: DeviceNotificationEvent): Promise<string> {
    // assert(deviceId == deviceNotificationEvent.deviceId)
    const deviceEntity: DeviceEntity = deviceNotificationEvent
    this.eventService.publish('device_notification_event', deviceNotificationEvent)
    await this.keyValueService.put('device_entity', deviceEntity.deviceId, deviceEntity)
    return '"OK"'
  }


  @Get('/v1/person/:personId')
  async getPerson(@Param('personId') personId: string): Promise<string> {
    const personEntity = await this.keyValueService.get<PersonEntity>('person_entity', personId)
    const status = personEntity ? RegistrationStatus.REGISTERED : RegistrationStatus.NOT_REGISTERED
    return RegistrationStatus[status]
  }

  @Post('/v1/person/:personId/profile')
  async postPersonProfile(@Param('personId') personId: string,
      @Body() personProfileEvent: PersonProfileEvent): Promise<string> {
    // assert(personId == personProfileEvent.personId)
    const personEntity: PersonEntity = {...personProfileEvent, deviceId: personProfileEvent.eventInfo?.deviceId}
    this.eventService.publish('person_profile_event', personProfileEvent)
    this.keyValueService.put('person_entity', personEntity.personId, personEntity)
    return '"OK"'
  }

  @Post('/v1/person/:personId/travelHistory')
  async postPersonTravelHistory(@Param('personId') personId: string,
      @Body() personTravelHistoryEvent: PersonTravelHistoryEvent): Promise<string> {
    // assert(personId == personTravelHistoryEvent.personId)
    this.eventService.publish('person_travel_history_event', personTravelHistoryEvent)
    return '"OK"'
  }

  @Post('/v1/person/:personId/symptoms')
  async postPersonSymptoms(@Param('personId') personId: string,
      @Body() personSymptomsEvent: PersonSymptomsEvent & ExperimentalEventInfo): Promise<NextSteps> {
    // assert(personId == personSymptomsEvent.personId)
    this.eventService.publish('person_symptoms_event', personSymptomsEvent)
    return this.countryService.decideNextSteps(personSymptomsEvent)
  }


  @Get('/v1/test/:testId')
  async getTest(@Param('testId') testId: string): Promise<string> {
    const testEntity = await this.keyValueService.get<TestEntity>('test_entity', testId)
    const labResult = testEntity?.labResult || LabResult.UNKNOWN
    return LabResult[labResult]
  }

  @Post('/v1/test/:testId/pair')
  async postTestPair(@Param('testId') testId: string,
      @Body() testPairEvent: TestPairEvent): Promise<string> {
    const testEntity = await this.keyValueService.get<TestEntity>('test_entity', testId)
    const updatedTestEntity: TestEntity = {...testEntity, ...testPairEvent, labResult: LabResult.IN_PROGRESS}
    await Promise.all([
      this.keyValueService.put('test_entity', updatedTestEntity.testId, updatedTestEntity),
      this.eventService.publish('test_pair_event', testPairEvent)
    ])
    return '"OK"'
  }

  @Post('/v1/test/:testId/result')
  async postTestResult(@Param('testId') testId: string,
      @Body() testResultEvent: TestResultEvent): Promise<string> {
    const testEntity = await this.keyValueService.get<TestEntity>('test_entity', testId)
    if (!testEntity) {
      return '"ERROR: testId = $testId not is not paired yet. Please scan again."'
    }
    const updatedTestEntity: TestEntity = {...testEntity, ...testResultEvent}
    await Promise.all([
      this.keyValueService.put('test_entity', updatedTestEntity.testId, updatedTestEntity),
      // TODO: publish every event even on any errors
      this.eventService.publish('test_result_event', testResultEvent),
      this.notificationService.pushTestResultHack(testResultEvent),
    ])
    return '"OK"'
  }
}
