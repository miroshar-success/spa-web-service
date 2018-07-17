import {
    loadData,
    loadDataSuccess,
    loadDataFailure,
    searchData,
    removeData,
    addData,
    editData,
    sortData    
  } from '@redux/common/table/actions';

  
  const prefix = '@@books';
  
  export const loadBooks = loadData(prefix);
  export const loadBooksSuccess = loadDataSuccess(prefix);
  export const loadBooksFailure = loadDataFailure(prefix);
  
  export const searchBook = searchData(prefix);
  export const removeBook = removeData(prefix);
  export const addBook = addData(prefix);
  export const editBook = editData(prefix);
  export const sortBook = sortData(prefix);
  
