import { loadPersonsSaga, searchPersonSaga } from './personsSaga';
import { fork, all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    fork(loadPersonsSaga),
    fork(searchPersonSaga),
  ])
}