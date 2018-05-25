// import { loadPersonsSaga, searchPersonSaga } from './personsSaga';
import { loadFetchsSaga } from './fetchSaga';
import { signInUserSaga, signUpUserSaga } from './authSaga';
import { fork, all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    // fork(wsSaga),
    fork(signUpUserSaga),
    fork(signInUserSaga),
    fork(loadFetchsSaga),
  ])
}