// export interface EventService {
//   publish(streamName: string, event: any): Promise<void>
// }

export abstract class EventService {
  abstract publish(streamName: string, event: any): Promise<void>
}
