import { TableStateShape, TableActions, TableReducerNameSubscribers } from './types';
import { RootState } from '@redux/rootReducer';

export const initialState: TableStateShape = {
  data: [],
  pagination: {
    pageSize: 10,
    current: 1,
  },
  searchString: '',
  loading: false,
  error: '',
}

export function createNamedTableReducer(reducerFunction: any, reducerName: string) {
  return (state: TableStateShape = initialState, action: any) => {
    const name = action.type.split('/')[0];
    const isInitializationCall = state === undefined;
    if (name !== reducerName && !isInitializationCall) return state;
    return reducerFunction(state, action, reducerName);
  }
}

export function tableReducer(state: TableStateShape = initialState, action: any, reducerName: string) {
  switch (action.type) {
    

    case `${reducerName}/${TableActions.REMOVE_DATA}`:

    case `${reducerName}/${TableActions.EDIT_DATA}`:

    case `${reducerName}/${TableActions.LOAD_DATA}`: {
      return {
        ...state,
        loading: true,
      }
    }
    case `${reducerName}/${TableActions.LOAD_DATA_SUCCESS}`: {
      const { data, pagination } = action.payload;
      return {
        ...state,
        data,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        loading: false,
        error: '',
      }
    }
    case `${reducerName}/${TableActions.LOAD_DATA_FAILURE}`: {
      const { error } = action.payload;
      return {
        ...state,
        loading: false,
        error,
      }
    }
    case `${reducerName}/${TableActions.SEARCH_DATA}`: {
      const { value } = action.payload;
      return {
        ...state,
        loading: true,
        searchString: value,
      }
    }

    default: return state;
  }
}

// selectors
export const getData = (state: RootState, prefix: TableReducerNameSubscribers) => state[prefix.slice(2)].data
export const getSearchString = (state: RootState, prefix: TableReducerNameSubscribers) => state[prefix.slice(2)].searchString
export const getPagination = (state: RootState, prefix: TableReducerNameSubscribers) => state[prefix.slice(2)].pagination
export const getLoadingStatus = (state: RootState, prefix: TableReducerNameSubscribers) => state[prefix.slice(2)].loading
export const getError = (state: RootState, prefix: TableReducerNameSubscribers) => state[prefix.slice(2)].error