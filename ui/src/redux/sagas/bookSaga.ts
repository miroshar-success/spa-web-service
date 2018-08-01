import { fork } from 'redux-saga/effects';
import { Book } from '@redux/books/types';
import { loadDataSaga, searchDataSaga, removeDataSaga, addDataSaga, editDataSaga, sortDataSaga, genreSortSaga, sortBookByCostSaga } from '@redux/common/table/sagas';
import { TableReducerNameSubscribers } from '@redux/common/table/types';

const prefix = TableReducerNameSubscribers.BOOKS;

export function* loadBooksSaga(): IterableIterator<any> {
  yield fork(loadDataSaga, prefix, getSuccessPayload);
}

export function* searchBookSaga(): IterableIterator<any> {
  yield fork(searchDataSaga, prefix, getSuccessPayload);
}

export function* removeBookSaga(): IterableIterator<any> {
  yield fork(removeDataSaga, prefix, getSuccessPayload)
}

export function* addBookSaga(): IterableIterator<any> {
  yield fork(addDataSaga, prefix, getSuccessPayload)
}

export function* editBookSaga(): IterableIterator<any> {
  yield fork(editDataSaga, prefix, getSuccessPayload)
}

export function* sortBookSaga(): IterableIterator<any> {
  yield fork(sortDataSaga, prefix, getSuccessPayload)
}

export function* sortBookSaga2(): IterableIterator<any> {
  yield fork(genreSortSaga, prefix, getSuccessPayload)
}

export function* sortBookByCost(): IterableIterator<any> {
  yield fork(sortBookByCostSaga, prefix, getSuccessPayload)
}


const getSuccessPayload = (books: Array<Book>) => {
  //debugger
  return books.map(( {_id, name, author, cost, genre, url} : Book) => ({
    key: _id,
    name,
    author,
    cost,
    genre,
    url
  }))
}