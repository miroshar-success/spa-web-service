import {
    loadData,
    loadDataSuccess,
    loadDataFailure,
    searchData,
    removeData,
    addData,
    editData,
  } from '@redux/common/table/actions';

  
  const prefix = '@@authors';
  
  export const loadAuthors = loadData(prefix);
  export const loadAuthorsSuccess = loadDataSuccess(prefix);
  export const loadAuthorsFailure = loadDataFailure(prefix);
  
  export const searchAuthors = searchData(prefix);
  export const removeAuthors = removeData(prefix);
  export const addAuthors = addData(prefix);
  export const editAuthors = editData(prefix);
  
