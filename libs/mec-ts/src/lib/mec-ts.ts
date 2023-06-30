import { Calendar, Event } from './types';
import { IResponse, ISpeakers } from './types/response';
import TurndownService from 'turndown';
import ky from 'ky';
import { Remarkable } from 'remarkable';

export * from './types';

export class MEC {
  public readonly response: IResponse;
  private _parsed: Calendar = {};

  constructor(response: IResponse) {
    this.response = response;
    for (const date in response.content_json) {
      const events = response.content_json[date].map(
        (event) =>
          ({
            id: event.ID,
            title: event.data.post.post_title,
            startTime: event.data.time.start,
            endTime: event.data.time.end,
            contentHTML: event.data.content,
            excerpt: event.data.post.post_excerpt,
            speakers: Object.values(event.data.speakers ?? {}),
            locations: Object.values(event.data.locations ?? {}),
            categories: Object.values(event.data.categories ?? {}),
            fields: event.data.fields,
            startDate: new Date(event.data.time.start_timestamp * 1000),
            link: event.data.permalink,
          } as Event)
      );
      this._parsed[date] = events;
    }
    console.log('[MEC] Successfully parsed events:', this._parsed);
  }

  public static async init(apiEndpoint: string) {
    const response = (await ky.get(apiEndpoint).json()) as IResponse;
    console.log('[MEC] loaded response', response);
    return new MEC(response);
  }

  public get(date: '2023-07-18' | '2023-07-19' | '2023-07-20' | '2023-07-21') {
    return new UnresolvedEvents(this._parsed[date]);
  }

  public async translate(translateFn: (string: string) => Promise<string>) {
    const turndownService = new TurndownService();
    const remarkable = new Remarkable({
      html: false, // Enable HTML tags in source
      xhtmlOut: false, // Use '/' to close single tags (<br />)
      breaks: false, // Convert '\n' in paragraphs into <br>
      linkify: false, // Autoconvert URL-like text to links

      // Enable some language-neutral replacement + quotes beautification
      typographer: true,
    });

    for (const dat in this._parsed) {
      console.log(`[MEC] Translating ${dat}`);
      for (const event of this._parsed[dat]) {
        event['title'] = await translateFn(event.title);
        event['excerpt'] = await translateFn(event.excerpt);

        const contentMD = turndownService.turndown(event.contentHTML);
        const translatedContentMD = await translateFn(contentMD);
        event['contentHTML'] = remarkable.render(translatedContentMD);

        for (const category of event['categories'])
          category['name'] = await translateFn(category.name);
      }
    }

    return this;
  }
}

export class UnresolvedEvents {
  private _events: Event[];

  constructor(events: Event[]) {
    this._events = events;
  }

  public resolve() {
    return this._events;
  }

  public async translate(translateFn: (string: string) => Promise<string>) {
    const turndownService = new TurndownService();
    const remarkable = new Remarkable({
      html: false, // Enable HTML tags in source
      xhtmlOut: false, // Use '/' to close single tags (<br />)
      breaks: false, // Convert '\n' in paragraphs into <br>
      linkify: false, // Autoconvert URL-like text to links

      // Enable some language-neutral replacement + quotes beautification
      typographer: true,
    });

    for (const event of this._events) {
      event['title'] = await translateFn(event.title);
      event['excerpt'] = await translateFn(event.excerpt);

      const contentMD = turndownService.turndown(event.contentHTML);
      const translatedContentMD = await translateFn(contentMD);
      event['contentHTML'] = remarkable.render(translatedContentMD);

      for (const category of event['categories'])
        category['name'] = await translateFn(category.name);
    }

    return this;
  }
}
// function firstProp<T>(obj: Record<any, T>): T | null {
//   console.log('getting first prop for', obj);
//   return Object.keys(obj).length > 0 ? obj[Object.keys(obj)[0]] : null;
// }
