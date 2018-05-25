import { createAction } from 'typesafe-actions';
import { AuthActions, SignInUser, SignUpUser } from './types';

// sign up
export const signUp = createAction(AuthActions.SIGN_UP, resolve => {
  return (user: SignUpUser) => resolve({ user });
})

export const signUpSuccess = createAction(AuthActions.SIGN_UP_SUCCESS, resolve => {
  return () => resolve();
})

export const signUpFailure = createAction(AuthActions.SIGN_UP_FAILURE, resolve => {
  return (error: string) => resolve({ error });
})

// sign in

export const signIn = createAction(AuthActions.SIGN_IN, resolve => {
  return (user: SignInUser) => resolve({ user });
})

export const signInSuccess = createAction(AuthActions.SIGN_IN_SUCCESS, resolve => {
  return () => resolve();
})

export const signInFailure = createAction(AuthActions.SIGN_IN_FAILURE, resolve => {
  return (error: string) => resolve({ error });
})

// sign out

export const signOut = createAction(AuthActions.SIGN_OUT, resolve => {
  return () => resolve();
})

export const signOutSuccess = createAction(AuthActions.SIGN_OUT_SUCCESS, resolve => {
  return () => resolve();
})

export const signOutFailure = createAction(AuthActions.SIGN_OUT_FAILURE, resolve => {
  return (error: string) => resolve({ error });
})