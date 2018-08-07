import { Reducer, combineReducers } from 'redux';
import { booksReducer } from '@redux/books/reducer';
import { authorReducer } from '@redux/authors/reducer';
import { BooksState } from '@redux/books/types';
import { AuthorsState} from '@redux/authors/types';

export interface RootState {
  books: BooksState;
  authors: AuthorsState;
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({  
  authors: authorReducer,
  books: booksReducer 
  
})

export default rootReducer;