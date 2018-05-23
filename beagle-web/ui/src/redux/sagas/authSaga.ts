import { take, call, put } from 'redux-saga/effects';
import { AuthActions, SignInUser, SignUpUser } from '@redux/auth/types';
import { push } from 'react-router-redux';
import { TokenManager } from '@components/ProtectedRoute/ProtectedRoute';

import * as Api from '@redux/auth/api';

function* signUpUser(user: SignUpUser): IterableIterator<any> {
  try {
    yield call(Api.signUp, user);
    yield put(push('/signin'));
  } catch (error) {
    // TODO: handle exception
    console.log(error)
  }
}

function* signInUser(user: SignInUser): IterableIterator<any> {
  try {
    const response = yield call(Api.signIn, user);
    TokenManager.setToken(response.data.accessToken);
    yield put(push('/'));
  } catch (error) {
    // TODO: handle exception
    console.log(error)
  }

}

// watchers

export function* signUpUserSaga(): IterableIterator<any> {
  const { payload: { user } } = yield take(AuthActions.SIGN_UP);
  yield call(signUpUser, user);
}

export function* signInUserSaga(): IterableIterator<any> {
  while (true) {
    const { payload: { user } } = yield take(AuthActions.SIGN_IN)
    yield call(signInUser, user);
  }

}

export function* signOutUserSaga(): IterableIterator<any> {

}