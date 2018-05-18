import { loadPersonsSaga, searchPersonSaga } from './personsSaga';
import { loadFetchsSaga, searchFetchSaga, removeFetchSaga } from './fetchSaga';
import { fork, all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    fork(loadPersonsSaga),
    fork(searchPersonSaga),
    fork(loadFetchsSaga),
    fork(searchFetchSaga),
    fork(removeFetchSaga),
  ])
}