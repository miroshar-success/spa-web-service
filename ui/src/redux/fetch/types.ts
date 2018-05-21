import { ClientName, TableStateShape } from '@redux/common/table/types';

export interface FetchsState extends TableStateShape { }

// define Fetch model
export interface Fetch {
  _id: string;
  clientName: ClientName;
  personKey: string;
  fetchUrl: string,
  createDate: string;
  state: string;
  selectors: Array<FetchExploreSelectors>;
  selector: string;
  updateDate: string;
  lastResult: string[];
}

export interface FetchExploreSelectors {
  sampleUrl: string;
  selector: string;
}