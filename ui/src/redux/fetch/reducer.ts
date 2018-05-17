import {
  FetchKeys,
  FetchState,
  FetchActionTypes
} from './types';

import {
  RootState,
} from '../rootReducer';

export const initialState: FetchState = {
  fetchs: [],
  pagination: {
    pageSize: 10,
    current: 1,
  },
  loading: false,
  error: '',
}

function fetchsReducer(state: FetchState = initialState, action: FetchActionTypes) {
  switch (action.type) {
    case FetchKeys.SEARCH_FETCHS:
    case FetchKeys.LOAD_FETCHS: {
      return {
        ...state,
        loading: true,
      }
    }
    case FetchKeys.LOAD_FETCHS_SUCCESS: {
      const { fetchs, pagination } = action.payload;
      return {
        ...state,
        fetchs,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        loading: false,
        error: '',
      }
    }
    case FetchKeys.LOAD_FETCHS_FAILURE: {
      const { error } = action.payload;
      return {
        ...state,
        loading: false,
        error,
      }
    }
    default: return state;
  }
}

// selectors
export const getFetchs = (state: RootState) => state.fetch.fetchs
export const getPagination = (state: RootState) => state.persons.pagination
export const getLoadingStatus = (state: RootState) => state.persons.loading
export const getError = (state: RootState) => state.persons.error

export default fetchsReducer;