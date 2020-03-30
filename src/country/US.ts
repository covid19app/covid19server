import { CountryApi } from 'src/CountryApi';
import { Action, NextSteps, PersonSymptomsEvent } from 'src/schema';

export default class USApi implements CountryApi {
  decideNextSteps(personSymptomsEvent: PersonSymptomsEvent): NextSteps {
    if (personSymptomsEvent.feverInCelsius > 37.5) {
      const externalLink = 'https://www.google.com/maps/search/?api=1&query=hospital'
      return {
        action: Action.GET_TESTED,
        text: 'Your symptoms sggests you may have contracted the virus. Hopefully not. But let\'s get you tested!',
        html: `
          <h1>DEMO!!! Just fake for now, do NOT follow these instructions...</h1>
          <p style="font-size: 48;">Feaver is often symtom of Coronavirus infection!</p>
          <p style="font-size: 48;">Please isolate youself from others as much as possible.</p>
          <a style="font-size: 48;" href="${externalLink}">Head to the nearest lab please!</a>
        `,
        externalLink,
        externalLinkTitle: 'Go to Lab!',
      }
    } else {
      return {
        action: Action.STAY_HEALTHY,
        text: 'Please take care of your health and your community! Here are some basic tips tips!',
        // html: `
        //   <h1>DEMO!!! just fake for now, do NOT follow these instructions...</h1>
        //   <p style="font-size: 48;">There is no reason to be worried. Go on with your life. But please be careful!</p>
        // `,
      }
    }
  }
}
