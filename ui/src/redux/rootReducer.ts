import { Reducer, combineReducers } from 'redux';
import { booksReducer } from '@redux/books/reducer';
import { BooksState } from '@redux/books/types';


export interface RootState {
  [reducerName: string]: BooksState
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({  
  books: booksReducer
})

export default rootReducer;