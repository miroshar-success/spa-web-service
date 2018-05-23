import { Reducer, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { personsReducer } from '@redux/persons/reducer';
import { fetchsReducer } from '@redux/fetch/reducer';
import { PersonsState } from '@redux/persons/types';
import { FetchsState } from '@redux/fetch/types';

export interface RootState {
  persons: PersonsState;
  fetchs: FetchsState;
  routing: any;
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  persons: personsReducer,
  fetchs: fetchsReducer,
  routing: routerReducer,
})

export default rootReducer;