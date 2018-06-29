import { loadBooksSaga, searchBookSaga, removeBookSaga, addBookSaga, editBookSaga } from './bookSaga';
import { fork, all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([    
    fork(loadBooksSaga),
    fork(searchBookSaga),
    fork(removeBookSaga),
    fork(addBookSaga),
    fork(editBookSaga)    
  ])
}