import { fork } from 'redux-saga/effects';
import { Book } from '@redux/books/types';
import { loadDataSaga, searchDataSaga, removeDataSaga, addDataFailSaga, addDataSaga, editDataSaga, sortDataSaga  
} from '@redux/books/sagasBooks';

export function* loadBooksSaga(): IterableIterator<any> {
  yield fork(loadDataSaga, getSuccessPayload);
}

export function* searchBookSaga(): IterableIterator<any> {
  yield fork(searchDataSaga, getSuccessPayload);
}

export function* removeBookSaga(): IterableIterator<any> {
  yield fork(removeDataSaga, getSuccessPayload)
}

export function* addBookSaga(): IterableIterator<any> {
  yield fork(addDataSaga, getSuccessPayload)
}

export function* addBookFailSaga(): IterableIterator<any> {
  yield fork(addDataFailSaga)
}

export function* editBookSaga(): IterableIterator<any> {
  yield fork(editDataSaga,  getSuccessPayload)
}

export function* sortBookSaga(): IterableIterator<any> {
  yield fork(sortDataSaga,  getSuccessPayload)
}

const getSuccessPayload = (books: Array<Book>) => {
  return books.map(( {_id, name, author, cost, genre, url} : Book) => ({
    key: _id,
    name,
    author,
    cost,
    genre,
    url
  }))
}