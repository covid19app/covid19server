import { CountryApi } from 'src/CountryApi';
import { Action, NextSteps, PersonSymptomsEvent } from 'src/schema';

export default class CZApi implements CountryApi {
  decideNextSteps(personSymptomsEvent: PersonSymptomsEvent): NextSteps {
    if (personSymptomsEvent.feverInCelsius > 37.5) {
      const externalLink = 'https://www.google.com/maps/d/u/0/viewer?mid=1MZ8KrgPvn-E4JmNQS8U4vE7Y73B3YpsA'
      return {
        action: Action.GET_TESTED,
        text: 'Vaše příznaky naznačují možnou nákazu. Doufejme že ne. Ale raději se nechte otestovat!',
        html: `
          <h1>DEMO!!! Prozatím nesmysly, v žádném případě nasledující řádky neberte vážně...</h1>
          <p style="font-size: 48;">Horečka je častým symptomem onemocnění Covid-19.</p>
          <p style="font-size: 48;">Prosím izolujte se od ostatních lidí jak je to jen možné.</p>
          <a style="font-size: 48;" href="${externalLink}">Jděte prosím do nejbližší laboratoře!</a>
        `,
        externalLink,
        externalLinkTitle: 'Jděte do laboratoře!',
      }
    } else {
      return {
        action: Action.STAY_HEALTHY,
        text: 'Dbejte prosím o zdraví své i vašeho okolí. Tady je pár základních tipů!',
        // html: `
        //   <h1>DEMO!!! prozatím nesmysly, v žádném případě nasledující řádky neberte vážně...</h1>
        //   <p style="font-size: 48;">Není žádný důvod se obávat. Užívejte si života. Ale buďte prosím opatrní!</p>
        // `,
      }
    }
  }
}
