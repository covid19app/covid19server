import { DynamicModule, Module, Provider } from '@nestjs/common';

import { ApiController } from './api.controller';
import { CountryService } from './country.service';
import { DynamoDbService } from './dynamodb.service';
import { FirehoseService } from './firehose.service';
import { NotificationService } from './notification.service';
import { JsonFileEventService, JsonFileKeyValueService } from './test.service';

@Module({
  imports: [ApiModule.createPerstanceServicesModule()],
  controllers: [ApiController],
  providers: [
    CountryService,
    NotificationService,
  ],
})
export class ApiModule {
  static createPerstanceServicesModule(): DynamicModule {
    let providers: Provider[]
    if (process.env.COVID19SERVER_JSON) {
      providers = [
        { provide: 'EventService', useClass: JsonFileEventService },
        { provide: 'KeyValueService', useClass: JsonFileKeyValueService },
      ]
    } else {
      providers = [
        { provide: 'EventService', useClass: FirehoseService },
        { provide: 'KeyValueService', useClass: DynamoDbService },
      ]
    }
    return { module: ApiModule, providers, exports: providers }
  }
}
