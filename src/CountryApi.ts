import { NextSteps, PersonSymptomsEvent } from 'src/schema';

export interface CountryApi {
  decideNextSteps(personSymptomsEvent: PersonSymptomsEvent): NextSteps
}
