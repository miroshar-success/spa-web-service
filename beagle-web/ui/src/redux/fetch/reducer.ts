import { createNamedTableReducer, tableReducer } from '@redux/common/table/reducer';
import { TableReducerNameSubscribers } from '@redux/common/table/types';

export const fetchsReducer = createNamedTableReducer(tableReducer, TableReducerNameSubscribers.FETCHS);

// // import { TableStateShape, TableActions, TableReducerNameSubscribers } from './types';
// import { TableActions } from '@redux/common/table/types';
// // import { RootState } from '@redux/rootReducer';

// export const initialState: any = {
//   fetchs: [],
// }


// export function fetchsReducer(state: any = initialState, action: any) {
//   switch (action.type) {
//     case TableActions.LOAD_DATA_SUCCESS: {
//       const { fetchs } = action.payload;
//       return {
//         ...state,
//         fetchs,
//       }
//     }
//     default: return state;
//   }
// }

// selectors
// export const getData = (state: RootState, prefix: TableReducerNameSubscribers) => state[prefix.slice(2)].data
// export const getSearchString = (state: RootState, prefix: TableReducerNameSubscribers) => state[prefix.slice(2)].searchString
// export const getPagination = (state: RootState, prefix: TableReducerNameSubscribers) => state[prefix.slice(2)].pagination
// export const getLoadingStatus = (state: RootState, prefix: TableReducerNameSubscribers) => state[prefix.slice(2)].loading
// export const getError = (state: RootState, prefix: TableReducerNameSubscribers) => state[prefix.slice(2)].error

// export const getData = (state: RootState, prefix: TableReducerNameSubscribers) => state.persons.data
// export const getSearchString = (state: RootState, prefix: TableReducerNameSubscribers) => state.persons.searchString
// export const getPagination = (state: RootState, prefix: TableReducerNameSubscribers) => state.persons.pagination
// export const getLoadingStatus = (state: RootState, prefix: TableReducerNameSubscribers) => state.persons.loading
// export const getError = (state: RootState, prefix: TableReducerNameSubscribers) => state.persons.error