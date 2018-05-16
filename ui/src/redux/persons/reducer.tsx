import {
  PersonKeys,
  PersonState,
  PersonActionTypes,
} from './types';

import {
  RootState,
} from '../rootReducer';

export const initialState: PersonState = {
  persons: [],
  pagination: {
    pageSize: 10,
    current: 1,
  },
  loading: false,
  error: '',
}

function personsReducer(state: PersonState = initialState, action: PersonActionTypes) {
  switch (action.type) {
    case PersonKeys.LOAD_PERSONS: {
      return {
        ...state,
        loading: true,
      }
    }
    case PersonKeys.LOAD_PERSONS_SUCCESS: {
      const { persons, pagination } = action.payload;
      return {
        ...state,
        persons,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        loading: false,
        error: '',
      }
    }
    case PersonKeys.LOAD_PERSONS_FAILURE: {
      const { error } = action.payload;
      return {
        ...state,
        loading: false,
        error,
      }
    }
    case PersonKeys.SEARCH_PERSON: {
      return {
        ...state,
        loading: true,
      }
    }
    default: return state;
  }
}

// selectors
export const getPersons = (state: RootState) => state.persons.persons
export const getPagination = (state: RootState) => state.persons.pagination
export const getLoadingStatus = (state: RootState) => state.persons.loading
export const getError = (state: RootState) => state.persons.error

export default personsReducer;