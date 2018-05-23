import { loadPersonsSaga, searchPersonSaga } from './personsSaga';
import { loadFetchsSaga, searchFetchSaga, removeFetchSaga } from './fetchSaga';
import { signInUserSaga, signUpUserSaga } from './authSaga';
import { fork, all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    fork(signUpUserSaga),
    fork(signInUserSaga),
    fork(loadPersonsSaga),
    fork(searchPersonSaga),
    fork(loadFetchsSaga),
    fork(searchFetchSaga),
    fork(removeFetchSaga),
  ])
}