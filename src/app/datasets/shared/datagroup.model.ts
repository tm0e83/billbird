import { Dataset } from './';

export class Datagroup {
  id: number;
  title: string;
  description?: string;
  datasets?: Dataset[];
}