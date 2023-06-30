import { ILocation, ICategory, ISpeaker, IFieldsItem } from './response';

export interface Calendar {
  [day: string]: Event[];
}

export interface Event {
  id: number;
  title: string;
  contentHTML: string;
  excerpt: string;
  startTime: string; // TODO Change to Date object and better localize with date-fns / day.js
  startDate: Date;
  endTime: string;
  speakers: ISpeaker[];
  locations: ILocation[];
  categories: ICategory[];
  fields: IFieldsItem[];
  link: string;
}
