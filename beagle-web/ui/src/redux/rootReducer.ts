import { Reducer, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { authReducer } from '@redux/auth/reducer';
import { personsReducer } from '@redux/persons/reducer';
import { fetchsReducer } from '@redux/fetch/reducer';
import { userFetchsReducer } from '@redux/userFetchs/reducer';
import { PersonsState } from '@redux/persons/types';
import { FetchsState } from '@redux/fetch/types';

export interface RootState {
  auth: any,
  persons: PersonsState;
  fetchs: FetchsState;
  userFetchs: any;
  routing: any;
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  auth: authReducer,
  persons: personsReducer,
  fetchs: fetchsReducer,
  userFetchs: userFetchsReducer,
  routing: routerReducer,
})

export default rootReducer;