// import { TableStateShape, TableActions, TableReducerNameSubscribers } from './types';
// import { TableActions } from '@redux/common/table/types';
import { UserFetchsActions } from './types';
import { RootState } from '@redux/rootReducer';

export const initialState: any = {
  fetches: [],
  sampleUrls: [],
  resultUrls: [],
}

export function userFetchsReducer(state: any = initialState, action: any) {
  switch (action.type) {
    // case TableActions.LOAD_DATA_SUCCESS: {
    //   const { data } = action.payload;
    //   return {
    //     ...state,
    //     data,
    //   }
    // }
    case UserFetchsActions.ADD_NEW_FETCH_FOR_EXPLORE_SUCCESS: {
      const { fetch, sampleUrls } = action.payload;
      return {
        ...state,
        fetches: state.fetches.concat(fetch),
        sampleUrls: state.sampleUrls.concat(sampleUrls),
      }
    }
    case UserFetchsActions.ADD_FETCH_RESULT: {
      const { resultUrls } = action.payload;
      return {
        ...state,
        resultUrls: state.resultUrls.concat(resultUrls),
      }
    }
    default: return state;
  }
}

// selectors
export const getUserFetchs = (state: RootState) => state.userFetchs.fetches;
export const getFetchSampleUrls = (state: RootState) => state.userFetchs.sampleUrls;
export const getResultUrls = (state: RootState) => state.userFetchs.resultUrls;