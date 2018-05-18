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
  searchString: '',
  loading: false,
  error: '',
}

function fetchsReducer(state: FetchState = initialState, action: FetchActionTypes) {
  switch (action.type) {
    case FetchKeys.REMOVE_FETCH:
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
    case FetchKeys.SEARCH_FETCHS: {
      const { value } = action.payload;
      return {
        ...state,
        searchString: value,
        loading: true,
      }
    }
    default: return state;
  }
}

// selectors
export const getFetchs = (state: RootState) => state.fetch.fetchs
export const getSearchString = (state: RootState) => state.fetch.searchString
export const getPagination = (state: RootState) => state.fetch.pagination
export const getLoadingStatus = (state: RootState) => state.fetch.loading
export const getError = (state: RootState) => state.fetch.error

export default fetchsReducer;