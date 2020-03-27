import { CountryApi } from 'src/CountryApi';
import { NextSteps, PersonSymptomsEvent } from 'src/schema';

export default class USApi implements CountryApi {
  decideNextSteps(personSymptomsEvent: PersonSymptomsEvent): NextSteps {
    if (personSymptomsEvent.feverInCelsius > 37.5) {
      const externalLink = 'https://www.google.com/maps/search/?api=1&query=hospital'
      return {
        html: `
          <h1>DEMO!!! just fake for now, do NOT follow these instructions...</h1>
          <p style="font-size: 40;">Feaver is often symtom of Coronavirus infection!</p>
          <p style="font-size: 20;">Please isolate youself from others as much as possible.</p>
          <a style="font-size: 40;" href="$externalLink">Head to the nearest lab please!</a>
        `,
        externalLink,
        externalLinkTitle: 'Go to Lab!',
      }
    } else {
      return {
        html: `
          <h1>DEMO!!! just fake for now, do NOT follow these instructions...</h1>
          <p style="font-size: 20;">There is no reason to be worried. Go on with your life. But please be careful!</p>
        `,
      }
    }
  }
}
