import { Reducer, combineReducers } from 'redux';
import counterReducer from './counter/reducer';
import { CounterState } from './counter/types';

export interface RootState {
  counter: CounterState,
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  counter: counterReducer,
})

export default rootReducer;