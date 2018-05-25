import { Reducer, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { authReducer } from '@redux/auth/reducer';
import { personsReducer } from '@redux/persons/reducer';
import { fetchsReducer } from '@redux/fetch/reducer';
import { PersonsState } from '@redux/persons/types';
import { FetchsState } from '@redux/fetch/types';

export interface RootState {
  auth: any,
  persons: PersonsState;
  fetchs: FetchsState;
  routing: any;
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  auth: authReducer,
  persons: personsReducer,
  fetchs: fetchsReducer,
  routing: routerReducer,
})

export default rootReducer;