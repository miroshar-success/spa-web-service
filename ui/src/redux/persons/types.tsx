import { Action } from 'redux';

// define initial state shape
export interface Person {
  _id?: string;
  personType: string;
  personId: string
}

export interface Pagination {
  pageSize: number;
  current: number;
  total?: number;
}

export interface PersonState {
  persons: Array<Person>;
  pagination: Pagination;
  loading: boolean;
  error: string;
}

// define action types
export enum PersonKeys {
  LOAD_PERSONS = "@@persons/LOAD_PERSONS",
  LOAD_PERSONS_SUCCESS = "@@persons/LOAD_PERSONS_SUCCESS",
  LOAD_PERSONS_FAILURE = "@@persons/LOAD_PERSONS_FAILURE",
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

export type PersonActionTypes =
  | LoadPersonsAction
  | LoadPersonsSuccessAction
  | LoadPersonsFailureAction