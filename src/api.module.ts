import { Module } from '@nestjs/common';

import { ApiController } from './api.controller';
import { CountryService } from './country.service';
import { DynamoDbService } from './dynamodb.service';
import { FirehoseService } from './firehose.service';

@Module({
  imports: [],
  controllers: [ApiController],
  providers: [
    CountryService,
    { provide: 'EventService', useClass: DynamoDbService },
    { provide: 'KeyValueService', useClass: FirehoseService },
  ],
})
export class ApiModule {}
