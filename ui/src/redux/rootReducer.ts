import { Reducer, combineReducers } from 'redux';
import counterReducer from '@redux/counter/reducer';
import personsReducer from '@redux/persons/reducer';
import fetchsReducer from '@redux/fetch/reducer';
import { CounterState } from '@redux/counter/types';
import { PersonState } from '@redux/persons/types';
import { FetchState } from '@redux/fetch/types';

export interface RootState {
  counter: CounterState,
  persons: PersonState,
  fetch: FetchState,
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  counter: counterReducer,
  persons: personsReducer,
  fetch: fetchsReducer,
})

export default rootReducer;