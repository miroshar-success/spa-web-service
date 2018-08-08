import { RootState } from '@redux/rootReducer';
import { TableStateShape } from '@redux/common/table/types';

export const initialState: TableStateShape = {
  data: [],
  pagination: {
    pageSize: 10000,
    current: 1,
  },
  searchString: '',
  loading: false,
  error: '',
  
}

export function booksReducer(state: TableStateShape  = initialState, action: any) {
  switch (action.type) {
    
    case `@@books/SORT_DATA_SUCCESS`: {
      const { data } = action.payload;          
      return {
        ...state,
        data                       
      }
    }

    case `@@books/GENRE_SORT`:
        
    case `@@books/COST_SORT`:    
    
    case `@@books/REMOVE_DATA`:

    case `@@books/EDIT_DATA`:

    case `@@books/LOAD_DATA`: {           
      return {        
        ...state,        
        loading: true,
      }
    }

    case `@@books/LOAD_DATA_SUCCESS`: {
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
    case `@@books/LOAD_DATA_FAILURE`: {
      const { error } = action.payload;
      return {
        ...state,
        loading: false,
        error,
      }
    }
    case `@@books/SEARCH_DATA`: {
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
export const getData = (state: RootState) => state.books.data
export const getSearchString = (state: RootState) => state.books.searchString
export const getPagination = (state: RootState) => state.books.pagination
export const getLoadingStatus = (state: RootState) => state.books.loading
export const getError = (state: RootState) => state.books.error