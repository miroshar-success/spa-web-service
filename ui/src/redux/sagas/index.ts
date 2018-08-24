import { loadBooksSaga,  searchBookSaga, removeBookSaga, addBookSaga, editBookSaga, sortBookSaga, 
} from '@redux/sagas/bookSaga';
import { loadAuthorsSaga, searchAuthorSaga, removeAuthorSaga, addAuthorSaga, editAuthorSaga
} from '@redux/sagas/authorSaga';

import { fork, all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([    
    fork(loadBooksSaga),
    fork(searchBookSaga),
    fork(removeBookSaga),
    fork(addBookSaga),
    fork(editBookSaga),
    fork(sortBookSaga),

    fork(loadAuthorsSaga),
    fork(searchAuthorSaga),
    fork(removeAuthorSaga),
    fork(addAuthorSaga),
    fork(editAuthorSaga),

  ])
}