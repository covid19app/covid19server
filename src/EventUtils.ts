import { EventInfo } from './schema'

let idCounter = 0

export function freshId(prefix: string): string {
  return `${prefix}:${idCounter++}`
}

export function freshEventInfo(deviceId?: string): EventInfo {
  const eventInfo: EventInfo = {
    eventId: freshId('event'),
    deviceId: deviceId || freshId('device'),
    timestampInEpochS: Date.now() / 1000,
  }
  return eventInfo
}
