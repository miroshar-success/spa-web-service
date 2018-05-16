import { ActionCreator } from 'redux';
import {
  PersonKeys,
  LoadPersonsAction,
  LoadPersonsSuccessAction,
  LoadPersonsFailureAction,
  Pagination,
  Person,
} from './types';

export const loadPersons: ActionCreator<LoadPersonsAction> = (pagination: Pagination) => ({
  type: PersonKeys.LOAD_PERSONS,
  payload: {
    pagination,
  }
})

export const loadPersonsSuccess: ActionCreator<LoadPersonsSuccessAction> = (persons: Array<Person>, pagination: Pagination) => ({
  type: PersonKeys.LOAD_PERSONS_SUCCESS,
  payload: {
    persons,
    pagination,
  }
})

export const loadPersonsFailure: ActionCreator<LoadPersonsFailureAction> = (error: string) => ({
  type: PersonKeys.LOAD_PERSONS_FAILURE,
  payload: {
    error,
  }
})