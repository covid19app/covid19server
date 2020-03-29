import { Module } from '@nestjs/common';

import { ApiController } from './api.controller';
import { CountryService } from './country.service';
import { DynamoDbService } from './dynamodb.service';
import { FirehoseService } from './firehose.service';

@Module({
  imports: [],
  controllers: [ApiController],
  providers: [CountryService, DynamoDbService, FirehoseService],
})
export class AppModule {}
