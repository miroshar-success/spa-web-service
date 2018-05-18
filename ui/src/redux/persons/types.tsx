import { Action } from 'redux';

// define initial state shape
export interface Person {
  _id: string;
  clientName: ClientType;
  personKey: object;
  personInfo: PersonInfo;
}

export interface PersonInfo {
  name?: string;
  surname?: string;
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

export interface PersonState {
  persons: Array<Person>;
  pagination: Pagination;
  searchString: string;
  loading: boolean;
  error: string;
}

// define action types
export enum PersonKeys {
  LOAD_PERSONS = "@@persons/LOAD_PERSONS",
  LOAD_PERSONS_SUCCESS = "@@persons/LOAD_PERSONS_SUCCESS",
  LOAD_PERSONS_FAILURE = "@@persons/LOAD_PERSONS_FAILURE",
  SEARCH_PERSON = '@@persons/SEARCH_PERSON',
}

// declare actions types using interface
export interface LoadPersonsAction extends Action {
  type: PersonKeys.LOAD_PERSONS;
  payload: {
    pagination: Pagination,
  }
}

export interface LoadPersonsSuccessAction extends Action {
  type: PersonKeys.LOAD_PERSONS_SUCCESS;
  payload: {
    persons: Array<Person>,
    pagination: Pagination,
  }
}

export interface LoadPersonsFailureAction extends Action {
  type: PersonKeys.LOAD_PERSONS_FAILURE;
  payload: {
    error: string,
  }
}

export interface SearchPersonAction extends Action {
  type: PersonKeys.SEARCH_PERSON,
  payload: {
    value: string,
  }
}

export type PersonActionTypes =
  | LoadPersonsAction
  | LoadPersonsSuccessAction
  | LoadPersonsFailureAction
  | SearchPersonAction