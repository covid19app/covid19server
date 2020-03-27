import { Injectable } from '@nestjs/common';

import CZ from './country/CZ';
import US from './country/US';
import { CountryApi } from './CountryApi';
import { ExperimentalEventInfo, NextSteps, PersonSymptomsEvent } from './schema';

@Injectable()
export class CountryService {
  private defaultCountryCode: string = 'US'
  private countryApiPerCountryCode: { [key: string]: CountryApi; }  = {
    CZ: new CZ(),
    US: new US(),
  }

  decideNextSteps(personSymptomsEvent: PersonSymptomsEvent & ExperimentalEventInfo): NextSteps {
    const rawCountryCode = personSymptomsEvent.locale.substring(3)
    const countryCode = rawCountryCode in this.countryApiPerCountryCode && rawCountryCode || this.defaultCountryCode
    const countryApi = this.countryApiPerCountryCode[countryCode]
    return countryApi.decideNextSteps(personSymptomsEvent)
  }
}
