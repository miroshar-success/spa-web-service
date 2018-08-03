import { Reducer, combineReducers } from 'redux';
import { booksReducer } from '@redux/books/reducer';
import { authorsReducer } from '@redux/authors/reducer';
import { BooksState } from '@redux/books/types';
import { AuthorsState } from '@redux/authors/types';

export interface RootState {
  [reducerName: string]: BooksState
  books: BooksState;
  authors: AuthorsState
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({  
  books: booksReducer,
  authors: authorsReducer
})

export default rootReducer;