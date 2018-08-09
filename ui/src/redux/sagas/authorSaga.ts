import { fork } from 'redux-saga/effects';
import { Author } from '@redux/authors/types';
import { loadDataSaga, searchDataSaga, removeDataSaga, addDataSaga, editDataSaga
} from '@redux/authors/sagasAuthors';


export function* loadAuthorsSaga(): IterableIterator<any> {
  yield fork(loadDataSaga, getSuccessPayload);
}

export function* searchAuthorSaga(): IterableIterator<any> {
  yield fork(searchDataSaga, getSuccessPayload);
}

export function* removeAuthorSaga(): IterableIterator<any> {
  yield fork(removeDataSaga, getSuccessPayload)
}

export function* addAuthorSaga(): IterableIterator<any> {
  yield fork(addDataSaga, getSuccessPayload)
}

export function* editAuthorSaga(): IterableIterator<any> {
  yield fork(editDataSaga, getSuccessPayload)
}

const getSuccessPayload = (authors: Array<Author>) => {
  //console.log(authors)
  return authors.map(( {_id, name, surname, dob, dod} : Author) => ({
    key: _id,
    name,
    surname,
    dob,
    dod
  }))
}