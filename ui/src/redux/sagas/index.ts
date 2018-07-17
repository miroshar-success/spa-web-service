import { loadBooksSaga, searchBookSaga, removeBookSaga, addBookSaga, editBookSaga, sortBookSaga } from './bookSaga';
import { fork, all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([    
    fork(loadBooksSaga),
    fork(searchBookSaga),
    fork(removeBookSaga),
    fork(addBookSaga),
    fork(editBookSaga),
    fork(sortBookSaga)    
  ])
}