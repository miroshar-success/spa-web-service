import {
  loadData,
  loadDataSuccess,
  loadDataFailure,
  searchData,
} from '@redux/common/table/actions';

const prefix = '@@persons';

export const loadPersons = loadData(prefix);
export const loadPersonsSuccess = loadDataSuccess(prefix);
export const loadPersonsFailure = loadDataFailure(prefix);
export const searchPerson = searchData(prefix);