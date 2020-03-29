export type Key = string

export type Value = {[key: string]: any}

// export interface KeyValueService {
//   get<T>(typeNameOfT: string, key: Key): Promise<T>

//   put<T>(typeNameOfT: string, key: Key, value: T): Promise<void>
// }


export abstract class KeyValueService {
  abstract get<T>(typeNameOfT: string, key: Key): Promise<T>

  abstract put<T>(typeNameOfT: string, key: Key, value: T): Promise<void>
}
