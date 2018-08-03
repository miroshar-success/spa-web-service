import { fork } from 'redux-saga/effects';
import { Author } from '@redux/authors/types';
import { loadDataSaga, searchDataSaga, removeDataSaga, addDataSaga, editDataSaga
} from '@redux/common/table/sagas';

export function* loadAuthorsSaga(): IterableIterator<any> {
  yield fork(loadDataSaga, "@@authors", getSuccessPayload);
}

export function* searchAuthorSaga(): IterableIterator<any> {
  yield fork(searchDataSaga, "@@authors", getSuccessPayload);
}

export function* removeAuthorSaga(): IterableIterator<any> {
  yield fork(removeDataSaga, "@@authors", getSuccessPayload)
}

export function* addAuthorSaga(): IterableIterator<any> {
  yield fork(addDataSaga, "@@authors", getSuccessPayload)
}

export function* editAuthorSaga(): IterableIterator<any> {
  yield fork(editDataSaga, "@@authors", getSuccessPayload)
}

const getSuccessPayload = (authors: Array<Author>) => {
  return authors.map(( {_id, name, surname, lifetime} : Author) => ({
    key: _id,
    name,
    surname,
    lifetime
  }))
}