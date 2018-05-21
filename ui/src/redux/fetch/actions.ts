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