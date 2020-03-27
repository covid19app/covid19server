// TODO: share between covid19app and covid19server

export enum LabResult {
  UNKNOWN, IN_PROGRESS, NOT_INFECTED, INFECTED
}

export type LabResultStrings = keyof typeof LabResult

export enum Sex {
  UNKNOWN, MALE, FEMALE, NON_BINARY
}

export type SexStrings = keyof typeof Sex

export enum RegistrationStatus {
  UNKNOWN, NOT_REGISTERED, REGISTERED
}

export type RegistrationStatusStrings = keyof typeof RegistrationStatus

export enum Action {
  UNKNOWN, STAY_HEALTHY, GET_TESTED, SELF_QUARANTINE, CALL_DOCTOR, GO_TO_HOSPITAL
}

export type ActionStrings = keyof typeof Action

export interface NextSteps {
  // action: Action
  // action: string
  text?: string
  html?: string
  externalLink?: string
  externalLinkTitle?: string
}

// Events

export interface EventInfo {
  eventId: string
  deviceId: string
  timestampInEpochS: number
  // s2Cell?: string
}

export interface ExperimentalEventInfo {
  locale: string
  latitude?: number
  longtitude?: number
}

export interface Event {
  eventInfo?: EventInfo
}

export interface DeviceNotificationEvent extends Event {
  deviceId: string
  pushNotificationToken: string
}

export interface PersonProfileEvent extends Event {
  personId: string
  name?: string
  age?: number
  sex?: Sex
  locale?: string
  deactivated?: boolean
}

export interface PersonTravelHistoryEvent extends Event {
  personId: string
  country: string
  places: string[]
  startDate: Date
  endDate: Date
}

export interface PersonSymptomsEvent extends Event {
  personId: string
  feverInCelsius: number
  dryCough: number
  fatigue: number
  sputumProduction: number
  shortnessOfBreath: number
  musclePainOrJointPain: number
  soreThroat: number
  headache: number
  chills: number
  nauseaOrVomiting: number
  nasalCongestion: number
  diarrhoea: number
  haemoptysis: number
  conjunctivalCongestion: number
  other: Map<string, number>
}

export interface TestPairEvent extends Event {
  testId: string
  personId: string
}

export interface TestResultEvent extends Event {
  testId: string
  labResult: LabResult
}

// Database Entities

export interface DeviceEntity {
  deviceId: string
  pushNotificationToken?: string
  defaultPersonId?: string
}

export interface PersonEntity {
  personId: string
  deviceId: string
  age?: number
  sex?: Sex
  name?: string
  locale?: string
  deactivated?: boolean
}

export interface TestEntity {
  testId: string
  personId?: string
  labResult: LabResult
}
