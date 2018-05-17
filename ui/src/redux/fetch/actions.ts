import { ActionCreator } from 'redux';
import {
  FetchKeys,
  LoadFetchsAction,
  LoadFetchsSuccessAction,
  LoadFetchsFailureAction,
  SearchFetchAction,
} from './types';

export const loadFetchs: ActionCreator<LoadFetchsAction> = (pagination) => ({
  type: FetchKeys.LOAD_FETCHS,
  payload: {
    pagination,
  }
})

export const loadFetchsSuccess: ActionCreator<LoadFetchsSuccessAction> = (fetchs, pagination) => ({
  type: FetchKeys.LOAD_FETCHS_SUCCESS,
  payload: {
    fetchs,
    pagination,
  }
})

export const loadFetchsFailure: ActionCreator<LoadFetchsFailureAction> = (error) => ({
  type: FetchKeys.LOAD_FETCHS_FAILURE,
  payload: {
    error,
  }
})

export const searchFetch: ActionCreator<SearchFetchAction> = (value) => ({
  type: FetchKeys.SEARCH_FETCHS,
  payload: {
    value,
  }
})