import { loadBooksSaga, searchBookSaga, removeBookSaga, addBookSaga, editBookSaga, sortBookSaga, sortBookSaga2, sortBookByCost } from './bookSaga';
import { fork, all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([    
    fork(loadBooksSaga),
    fork(searchBookSaga),
    fork(removeBookSaga),
    fork(addBookSaga),
    fork(editBookSaga),
    fork(sortBookSaga),
    fork(sortBookSaga2),
    fork(sortBookByCost)
  ])
}