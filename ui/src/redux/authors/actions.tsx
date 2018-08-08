import {
    loadData,
    loadDataSuccess,
    loadDataFailure,
    searchData,
    removeData,
    addAuthorData,
    editAuthorData
  } from '@redux/common/table/actions';

  
  const prefix = '@@authors';
  
  export const loadAuthors = loadData(prefix);
  export const loadAuthorsSuccess = loadDataSuccess(prefix);
  export const loadAuthorsFailure = loadDataFailure(prefix);
  
  export const searchAuthors = searchData(prefix);
  export const removeAuthor = removeData(prefix);
  export const addAuthor = addAuthorData(prefix);
  export const editAuthor = editAuthorData(prefix);
  
  