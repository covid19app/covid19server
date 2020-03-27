import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { CountryService } from './country.service';
import { DynamoDbService } from './dynamodb.service';
import { FirehoseService } from './firehose.service';
import { DeviceEntity, DeviceNotificationEvent, ExperimentalEventInfo, LabResult, NextSteps,
  PersonEntity, PersonProfileEvent, PersonSymptomsEvent, PersonTravelHistoryEvent,
  RegistrationStatus, TestEntity, TestPairEvent, TestResultEvent} from './schema';

@Controller()
export class EventsController {
  constructor(
    private readonly countryService: CountryService,
    private readonly dynamoDbService: DynamoDbService,
    private readonly firehoseService: FirehoseService,
  ) {}

  @Get('/v1/device/:deviceId')
  async getDevice(@Param('deviceId') deviceId: string): Promise<RegistrationStatus> {
    const deviceEntity = await this.dynamoDbService.get<DeviceEntity>('device_entity', {deviceId})
    return deviceEntity && RegistrationStatus.REGISTERED || RegistrationStatus.NOT_REGISTERED
  }

  @Post('/v1/device/:deviceId/notification')
  async postDeviceNotification(@Param('deviceId') deviceId: string,
      @Body() deviceNotificationEvent: DeviceNotificationEvent): Promise<string> {
    // assert(deviceId == deviceNotificationEvent.deviceId)
    const deviceEntity: DeviceEntity = deviceNotificationEvent
    this.firehoseService.publish('device_notification_event', deviceNotificationEvent)
    await this.dynamoDbService.put('device_entity', deviceEntity)
    return '"OK"'
  }


  @Get('/v1/person/:personId')
  async getPerson(@Param('personId') personId: string): Promise<RegistrationStatus> {
    const personEntity = await this.dynamoDbService.get<PersonEntity>('person_entity', {personId})
    return personEntity && RegistrationStatus.REGISTERED || RegistrationStatus.NOT_REGISTERED
  }

  @Post('/v1/person/:personId/profile')
  async postPersonProfile(@Param('personId') personId: string,
      @Body() personProfileEvent: PersonProfileEvent): Promise<string> {
    // assert(personId == personProfileEvent.personId)
    const personEntity: PersonEntity = {...personProfileEvent, deviceId: personProfileEvent.eventInfo?.deviceId}
    this.firehoseService.publish('person_profile_event', personProfileEvent)
    this.dynamoDbService.put('person_entity', personEntity)
    return '"OK"'
  }

  @Post('/v1/person/:personId/travelHistory')
  async postPersonTravelHistory(@Param('personId') personId: string,
      @Body() personTravelHistoryEvent: PersonTravelHistoryEvent): Promise<string> {
    // assert(personId == personTravelHistoryEvent.personId)
    this.firehoseService.publish('person_travel_history_event', personTravelHistoryEvent)
    return '"OK"'
  }

  @Post('/v1/person/:personId/symptoms')
  async postPersonSymptoms(@Param('personId') personId: string,
      @Body() personSymptomsEvent: PersonSymptomsEvent & ExperimentalEventInfo): Promise<NextSteps> {
    // assert(personId == personSymptomsEvent.personId)
    this.firehoseService.publish('person_symptoms_event', personSymptomsEvent)
    return this.countryService.decideNextSteps(personSymptomsEvent)
  }


  @Get('/v1/test/:testId')
  async getTest(@Param('testId') testId: string): Promise<LabResult> {
    const testEntity = await this.dynamoDbService.get<TestEntity>('test_entity', {testId})
    return testEntity?.labResult || LabResult.UNKNOWN
  }

  @Post('/v1/test/:testId/pair')
  async postTestPair(@Param('testId') testId: string,
      @Body() testPairEvent: TestPairEvent): Promise<string> {
    const testEntity = await this.dynamoDbService.get<TestEntity>('test_entity', {testId})
    const updatedTestEntity: TestEntity = {...testEntity, ...testPairEvent, labResult: LabResult.IN_PROGRESS}
    await Promise.all([
      this.dynamoDbService.put('test_entity', updatedTestEntity),
      this.firehoseService.publish('test_pair_event', testPairEvent)
    ])
    return '"OK"'
  }

  @Post('/v1/test/:testId/result')
  async postTestResult(@Param('testId') testId: string,
      @Body() testResultEvent: TestResultEvent): Promise<string> {
    const testEntity = await this.dynamoDbService.get<TestEntity>('test_entity', {testId})
    if (!testEntity) {
      return '"ERROR: testId = $testId not is not paired yet. Please scan again."'
    }
    const updatedTestEntity: TestEntity = {...testEntity, ...testResultEvent}
    await Promise.all([
      this.dynamoDbService.put('test_entity', updatedTestEntity),
      // TODO: publish every event even on any errors
      this.firehoseService.publish('test_result_event', testResultEvent),
    ])
    return '"OK"'
  }
}
