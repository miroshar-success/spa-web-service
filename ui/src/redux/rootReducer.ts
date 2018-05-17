import { Reducer, combineReducers } from 'redux';
import counterReducer from '@redux/counter/reducer';
import personsReducer from '@redux/persons/reducer';
import { CounterState } from '@redux/counter/types';
import { PersonState } from '@redux/persons/types';

export interface RootState {
  counter: CounterState,
  persons: PersonState,
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  counter: counterReducer,
  persons: personsReducer,
})

export default rootReducer;