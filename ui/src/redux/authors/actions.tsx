import { createAction } from 'typesafe-actions';
import { Author } from  '@redux/authors/types'
 
export const loadAuthors= () => createAction(`@@authors/LOAD_AUTHORS}`, resolve => {
  return () => resolve({ })
});

export const loadAuthorsSuccess = () => createAction(`@@authors/LOAD_AUTHOR_SUCCESS`, resolve => {
  return (data: Array<Author>) => resolve({ data})
});

export const loadAuthorsFailure = () => createAction(`@@authors/LOAD_AUTHOR_FAILURE`, resolve => {
  return (error: string) => resolve({ error })
});

export const searchAuthor = () => createAction(`@@authors/SEARCH_AUTHOR`, resolve => {
    return (value: string) => resolve({ value })
});
  
  export const removeAuthor = () => createAction(`@@authors/REMOVE_AUTHOR`, resolve => {
    return (_id: string) => resolve({ _id })
  });
  
  export const addAuthor = () => createAction(`@@authors/ADD_AUTHOR`, resolve => {
    return (name: string, surname: string, lifetime: Date) => resolve({ name, surname, lifetime })
  });
  
  export const editAuthor = () => createAction(`@@authors/EDIT_AUTHOR`, resolve => {
    return (_id: string, name: string, surname: string, lifetime: Date) => resolve({ _id, name, surname, lifetime })
  });
