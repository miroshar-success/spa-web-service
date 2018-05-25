import {
  loadData,
  loadDataSuccess,
  loadDataFailure,
  searchData,
  removeData,
} from '@redux/common/table/actions';

const prefix = '@@fetchs';

export const loadFetchs = loadData(prefix);
export const loadFetchsSuccess = loadDataSuccess(prefix);
export const loadFetchssFailure = loadDataFailure(prefix);
export const searchFetch = searchData(prefix);
export const removeFetch = removeData(prefix);

// import { createAction } from 'typesafe-actions';
// import {
//   TableActions,
// } from '@redux/common/table/types';

// export const loadFetchs = createAction(`${TableActions.LOAD_DATA}`, resolve => {
//   return (personKey: string) => resolve({ personKey })
// });

// export const loadFetchsSuccess = createAction(`${TableActions.LOAD_DATA_SUCCESS}`, resolve => {
//   return (fetchs: any[]) => resolve({ fetchs })
// })

// export const removeData = createAction(`${TableActions.REMOVE_DATA}`, resolve => {
//   return (fetchUrl: string) => resolve({ fetchUrl })
// });