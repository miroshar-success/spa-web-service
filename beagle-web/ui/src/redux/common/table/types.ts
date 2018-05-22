import { Person } from '@redux/persons/types';
import { Fetch } from '@redux/fetch/types';

export enum TableActions {
  LOAD_DATA = 'LOAD_DATA',
  LOAD_DATA_SUCCESS = 'LOAD_DATA_SUCCESS',
  LOAD_DATA_FAILURE = 'LOAD_DATA_FAILURE',
  SEARCH_DATA = 'SEARCH_DATA',
  REMOVE_DATA = 'REMOVE_DATA',
}

export enum TableReducerNameSubscribers {
  PERSONS = '@@persons',
  FETCHS = '@@fetchs',
}

export interface TableStateShape {
  data: DataType;
  pagination: Pagination;
  searchString: string;
  loading: boolean;
  error: string;
}

// Sagas interfaces
export interface LoadDataProps {
  prefix: string;
  url: string;
  currentPage: number;
  needDelay: boolean;
  payloadFunc: Function;
}

export interface RemoveDataProps {
  prefix: string;
  id: string;
  payloadFunc: Function;
}
//===

export interface Pagination {
  pageSize: number;
  current: number;
  total?: number;
}

export enum ClientName {
  viber = 'viber',
  telegram = 'telegram',
}

export type DataType =
  | Array<Person>
  | Array<Fetch>