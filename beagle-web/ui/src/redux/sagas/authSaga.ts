import { take, call, put } from 'redux-saga/effects';
import { AuthActions, SignInUser, SignUpUser, Roles } from '@redux/auth/types';
import {
  signUpSuccess,
  signUpFailure,
  signInSuccess,
  signInFailure,
  getCurrentUserSuccess,
  getCurrentUserFailure,
  initWebsocket,
} from '@redux/auth/actions';
import { push } from 'react-router-redux';
import { TokenManager } from '@components/ProtectedRoute/ProtectedRoute';

import * as Api from '@redux/auth/api';

function* signUpUser(user: SignUpUser): IterableIterator<any> {
  try {
    yield call(Api.signUp, user);
    yield put(signUpSuccess());
    // Todo: call redirectToLoginPageSaga
    yield put(push('/signin'));
  } catch (error) {
    yield put(signUpFailure(error.message));
  }
}

function* signInUser(user: SignInUser): IterableIterator<any> {
  try {
    const { data: { accessToken, name } } = yield call(Api.signIn, user);
    TokenManager.setToken(accessToken);
    yield put(signInSuccess({
      name,
      // TODO: Change when roles will add
      role: name === 'admin'
        ? Roles.ADMIN
        : Roles.USER,
      authorized: true,
    }))
    yield put(push('/'));
  } catch (error) {
    yield put(signInFailure(error.message));
  }
}

function* getCurrentUser(): IterableIterator<any> {
  try {
    const response = yield call(Api.getCurrentUser)
    yield put(getCurrentUserSuccess({
      name: response.data,
      role: Roles.USER,
      authorized: true,
    }))
    yield put(initWebsocket())
  } catch (error) {
    yield put(getCurrentUserFailure(error.message))
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

export function* getCurrentUserSaga(): IterableIterator<any> {
  while (true) {
    yield take(AuthActions.GET_CURRENT_USER);
    yield call(getCurrentUser);
  }
}

export function* redirectToLoginPageSaga(): IterableIterator<any> {
  while (true) {
    yield take(AuthActions.REDIRECT_TO_LOGIN_PAGE);
    yield put(push('/signin'));
  }
}

export function* signOutUserSaga(): IterableIterator<any> {

}