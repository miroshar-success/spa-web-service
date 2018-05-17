import { Action } from 'redux';

// define initial state shape
export interface Fetch {
  clientName: ClientType;
  personKey: string;
  fetchUrl: string,
  createData: string;
  selectors: Array<FetchExploreSelectors>;
  selector: string;
  updateDate: string;
  lastResult: string[];
}

export enum ClientType {
  Telegram = 'Telegram',
  Viber = 'Viber',
}

export interface Pagination {
  pageSize: number;
  current: number;
  total?: number;
}

export interface FetchExploreSelectors {
  sampleUrl: string;
  selector: string;
}

export interface FetchState {
  fetchs: Array<Fetch>;
  pagination: Pagination;
  loading: boolean;
  error: string;
}

// define action types
export enum FetchKeys {
  LOAD_FETCHS = "@@fetch/LOAD_PERSONS",
  LOAD_FETCHS_SUCCESS = "@@fetch/LOAD_FETCHS_SUCCESS",
  LOAD_FETCHS_FAILURE = "@@fetch/LOAD_FETCHS_FAILURE",
  SEARCH_FETCHS = '@@fetch/SEARCH_FETCHS',
}

// declare actions types using interface
export interface LoadFetchsAction extends Action {
  type: FetchKeys.LOAD_FETCHS;
  payload: {
    pagination: Pagination,
  }
}

export interface LoadFetchsSuccessAction extends Action {
  type: FetchKeys.LOAD_FETCHS_SUCCESS;
  payload: {
    fetchs: Array<Fetch>,
    pagination: Pagination,
  }
}

export interface LoadFetchsFailureAction extends Action {
  type: FetchKeys.LOAD_FETCHS_FAILURE;
  payload: {
    error: string,
  }
}

export interface SearchFetchAction extends Action {
  type: FetchKeys.SEARCH_FETCHS,
  payload: {
    value: string,
  }
}

export type FetchActionTypes =
  | LoadFetchsAction
  | LoadFetchsSuccessAction
  | LoadFetchsFailureAction
  | SearchFetchAction