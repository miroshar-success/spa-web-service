// import { loadPersonsSaga, searchPersonSaga } from './personsSaga';
import { loadFetchsSaga } from './fetchSaga';
import { signInUserSaga, signUpUserSaga, getCurrentUserSaga, redirectToLoginPageSaga } from './authSaga';
import { loadUserFetchsSaga, wsSaga, addNewFetchUrlForExploreSaga, watchFetchSaga, removeFetchSaga } from './userFetchsSaga';
import { fork, all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    fork(wsSaga),
    fork(watchFetchSaga),
    fork(removeFetchSaga),
    fork(addNewFetchUrlForExploreSaga),
    fork(getCurrentUserSaga),
    fork(redirectToLoginPageSaga),
    fork(loadUserFetchsSaga),
    fork(signUpUserSaga),
    fork(signInUserSaga),
    fork(loadFetchsSaga),
  ])
}