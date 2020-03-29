import { Injectable } from '@nestjs/common';
import { Expo } from 'expo-server-sdk';

import { KeyValueService } from './keyvalue';
import { DeviceEntity, LabResult, NextSteps, PersonEntity, TestEntity, TestResultEvent } from './schema';

@Injectable()
export class NotificationService {
  constructor(
    private readonly keyValueService: KeyValueService,
  ) {}

  private expo = new Expo()

  async pushNextSteps(personId: string, nextSteps: NextSteps): Promise<void> {
    const personEntity = await this.keyValueService.get<PersonEntity>('person_entity', personId)
    const deviceId = personEntity.deviceId
    const deviceEntity = await this.keyValueService.get<DeviceEntity>('device_entity', deviceId)
    const pushNotificationToken = deviceEntity.pushNotificationToken
    const message = {
      to: pushNotificationToken,
      //   sound: 'default',
      body: nextSteps.externalLinkTitle || 'Open covid19app please!',
      data: nextSteps,
    }
    this.expo.sendPushNotificationsAsync([message])
  }

  async pushTestResultHack(testResultEvent: TestResultEvent): Promise<void> {
    const testId = testResultEvent.testId
    const testEntity = await this.keyValueService.get<TestEntity>('test_entity', testId)
    const personId = testEntity.personId
    const nextSteps: NextSteps = {
      text: LabResult[testResultEvent.labResult],
    }
    this.pushNextSteps(personId, nextSteps)
  }
}
