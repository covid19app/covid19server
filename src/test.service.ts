import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as jsonfile from 'jsonfile';

import { EventService } from './event';
import { Key, KeyValueService, Value } from './keyvalue';

// tslint:disable:max-classes-per-file

export interface Record {
  streamName: string
  event: any
}

@Injectable()
export class TestEventService extends EventService {
  records: Record[] = []

  async publish(streamName: string, event: any): Promise<void> {
    const msg = `EventTestService.publish(${streamName}, ...)`
    console.log({ msg, ...event, eventInfo: '--not-interesting--' })
    this.records.push({streamName, event})
  }
}

// TODO: should we use https://jestjs.io/docs/en/dynamodb instead?
@Injectable()
export class TestKeyValueService extends KeyValueService {
  items = new Map<string, Map<Key, Value>>()

  async get<T>(typeNameOfT: string, key: Key): Promise<T> {
    const msg = `KeyValueTestService.get(${typeNameOfT}, ${key})`
    const value = this.items.get(typeNameOfT)?.get(key) as T
    console.log({ msg, ...value, eventInfo: '--not-interesting--' })
    return value
}

  async put<T>(typeNameOfT: string, key: Key, value: T): Promise<void> {
    const msg = `KeyValueTestService.put(${typeNameOfT}, ${key}, ...)`
    console.log({ msg, ...value, eventInfo: '--not-interesting--' })
    if (!this.items.get(typeNameOfT)) {
      this.items.set(typeNameOfT, new Map<Key, Value>())
    }
    this.items.get(typeNameOfT)?.set(key, value)
  }
}

@Injectable()
export class JsonFileEventService extends EventService {
  async publish(streamName: string, event: any): Promise<void> {
    const msg = `EventTestService.publish(${streamName}, ...)`
    console.log({ msg, ...event, eventInfo: '--not-interesting--' })
    writeJsonFile(`event/${streamName}/${Date.now()}.json`, event)
  }
}

@Injectable()
export class JsonFileKeyValueService extends KeyValueService {
  async get<T>(typeNameOfT: string, key: Key): Promise<T> {
    const msg = `KeyValueTestService.get(${typeNameOfT}, ${key})`
    const fileName = `keyvalue/${typeNameOfT}/${key}.json`
    try {
      const value = jsonfile.readFileSync(fileName)
      console.log({ msg, ...value, eventInfo: '--not-interesting--' })
      return value
    } catch {
      console.log({ msg, FileNotFound: fileName })
      return undefined
    }
  }

  async put<T>(typeNameOfT: string, key: Key, value: T): Promise<void> {
    const msg = `KeyValueTestService.put(${typeNameOfT}, ${key}, ...)`
    console.log({ msg, ...value, eventInfo: '--not-interesting--' })
    writeJsonFile(`keyvalue/${typeNameOfT}/${key}.json`, value)
  }
}

async function writeJsonFile(path: string, value: any): Promise<void> {
  const fullPath = `${process.env.COVID19SERVER_JSON || 'tmp'}/${path}`
  await fs.promises.mkdir(fullPath.substring(0, fullPath.lastIndexOf('/')), { recursive: true }).catch(console.error)
  jsonfile.writeFileSync(fullPath, value, {spaces: 2})
}
