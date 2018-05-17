import { ActionCreator } from 'redux';
import {
  PersonKeys,
  LoadPersonsAction,
  LoadPersonsSuccessAction,
  LoadPersonsFailureAction,
  SearchPersonAction,
} from './types';

export const loadPersons: ActionCreator<LoadPersonsAction> = (pagination) => ({
  type: PersonKeys.LOAD_PERSONS,
  payload: {
    pagination,
  }
})

export const loadPersonsSuccess: ActionCreator<LoadPersonsSuccessAction> = (persons, pagination) => ({
  type: PersonKeys.LOAD_PERSONS_SUCCESS,
  payload: {
    persons,
    pagination,
  }
})

export const loadPersonsFailure: ActionCreator<LoadPersonsFailureAction> = (error) => ({
  type: PersonKeys.LOAD_PERSONS_FAILURE,
  payload: {
    error,
  }
})

export const searchPerson: ActionCreator<SearchPersonAction> = (value) => ({
  type: PersonKeys.SEARCH_PERSON,
  payload: {
    value,
  }
})