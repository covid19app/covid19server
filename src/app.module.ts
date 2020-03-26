import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamoDbService } from './dynamodb.service';
import { EventsController } from './events.controller';
import { FirehoseService } from './firehose.service';

@Module({
  imports: [],
  controllers: [AppController, EventsController],
  providers: [AppService, DynamoDbService, FirehoseService],
})
export class AppModule {}
