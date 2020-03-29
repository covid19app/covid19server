import { Injectable } from '@nestjs/common';

import { Key, KeyValueService, Value } from './keyvalue';

// TODO: should we use https://jestjs.io/docs/en/dynamodb instead?
@Injectable()
export class TestKeyValueService extends KeyValueService {
  items = new Map<string, Map<Key, Value>>()

  async get<T>(typeNameOfT: string, key: Key): Promise<T> {
    console.log(`KeyValueTestService.get({${typeNameOfT}, ${key}})`)
    console.log(this.items.get(typeNameOfT)?.get(key) as T)
    return this.items.get(typeNameOfT)?.get(key) as T
  }

  async put<T>(typeNameOfT: string, key: Key, value: T): Promise<void> {
    console.log(`KeyValueTestService.put({${typeNameOfT}, ${key}, ${JSON.stringify(value)}})`)
    // const table = this.items.get(typeNameOfT) || this.items.set(typeNameOfT, new Map<Key, Value>())
    // table.set(key, value)
    if (!this.items.get(typeNameOfT)) {
      this.items.set(typeNameOfT, new Map<Key, Value>())
    }
    this.items.get(typeNameOfT)?.set(key, value)
  }
}
