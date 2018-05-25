import { take, call, put } from 'redux-saga/effects';
import { AuthActions, SignInUser, SignUpUser, Roles } from '@redux/auth/types';
import { push } from 'react-router-redux';
import { TokenManager } from '@components/ProtectedRoute/ProtectedRoute';

import * as Api from '@redux/auth/api';

function* signUpUser(user: SignUpUser): IterableIterator<any> {
  try {
    yield call(Api.signUp, user);
    yield put({ type: AuthActions.SIGN_UP_SUCCESS });
    yield put(push('/signin'));
  } catch (error) {
    yield put({
      type: AuthActions.SIGN_UP_FAILURE,
      payload: {
        error: error.message,
      }
    });
  }
}

function* signInUser(user: SignInUser): IterableIterator<any> {
  try {
    const { data: { accessToken, name } } = yield call(Api.signIn, user);
    TokenManager.setToken(accessToken);
    yield put({
      type: AuthActions.SIGN_IN_SUCCESS,
      payload: {
        userDetails: {
          name,
          // TODO: Change when roles will add
          role: name === 'admin'
            ? Roles.ADMIN
            : Roles.USER,
          authorized: true,
        }
      }
    })
    yield put(push('/'));
  } catch (error) {
    yield put({
      type: AuthActions.SIGN_UP_FAILURE,
      payload: {
        error: error.message,
      }
    });
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