import {
    loadData,
    loadDataSuccess,
    loadDataFailure,
    searchData,
    removeData,
    addBookData,
    editBookData,
    sortBookData,
  } from '@redux/common/table/actions';

  
  const prefix = '@@books';
  
  export const loadBooks = loadData(prefix);
  export const loadBooksSuccess = loadDataSuccess(prefix);
  export const loadBooksFailure = loadDataFailure(prefix);
  
  export const searchBook = searchData(prefix);
  export const removeBook = removeData(prefix);
  export const addBook = addBookData(prefix);
  export const editBook = editBookData(prefix);
  export const sortBook = sortBookData(prefix);
  
