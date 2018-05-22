import { Reducer, combineReducers } from 'redux';
import { personsReducer } from '@redux/persons/reducer';
import { fetchsReducer } from '@redux/fetch/reducer';
import { PersonsState } from '@redux/persons/types';
import { FetchsState } from '@redux/fetch/types';

export interface RootState {
  [reducerName: string]: PersonsState | FetchsState
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  persons: personsReducer,
  fetchs: fetchsReducer,
})

export default rootReducer;