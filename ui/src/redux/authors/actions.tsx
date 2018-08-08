import {
    loadData,
    loadDataSuccess,
    loadDataFailure,
    searchData,
    removeData,
    addData,
    editAuthorData
  } from '@redux/common/table/actions';

  
  const prefix = '@@authors';
  
  export const loadAuthors = loadData(prefix);
  export const loadAuthorsSuccess = loadDataSuccess(prefix);
  export const loadAuthorsFailure = loadDataFailure(prefix);
  
  export const searchAuthors = searchData(prefix);
  export const removeAuthor = removeData(prefix);
  export const addAuthors = addData(prefix);
  export const editAuthor = editAuthorData(prefix);
  
  