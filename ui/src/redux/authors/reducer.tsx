import { RootState } from '@redux/rootReducer';
import { TableStateShape } from '@redux/common/table/types';

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

export function authorReducer(state: TableStateShape  = initialState, action: any) {
  switch (action.type) {
    
    case `@@authors/SORT_DATA_SUCCESS`: {
      const { data } = action.payload;          
      return {
        ...state,
        data                       
      }
    }

    case `@@authors/GENRE_SORT`:
        
    case `@@authors/COST_SORT`:    
    
    case `@@authors/REMOVE_DATA`:

    case `@@authors/EDIT_DATA`:

    case `@@authors/LOAD_DATA`: {           
      return {        
        ...state,        
        loading: true,
      }
    }

    case `@@authors/LOAD_DATA_SUCCESS`: {
      const { data, pagination} = action.payload;
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
    case `@@authors/LOAD_DATA_FAILURE`: {
      const { error } = action.payload;
      return {
        ...state,
        loading: false,
        error,
      }
    }
    case `@@authors/SEARCH_DATA`: {
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

export const getData = (state: RootState) => state.authors.data
export const getSearchString = (state: RootState) => state.authors.searchString
export const getLoadingStatus = (state: RootState) => state.authors.loading
export const getError = (state: RootState) => state.authors.error
export const getPagination = (state: RootState) => state.authors.pagination