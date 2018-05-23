import { createAction } from 'typesafe-actions';
import { AuthActions, SignInUser, SignUpUser } from './types';

export const signUp = createAction(AuthActions.SIGN_UP, resolve => {
  return (user: SignUpUser) => resolve({ user });
})

export const signIn = createAction(AuthActions.SIGN_IN, resolve => {
  return (user: SignInUser) => resolve({ user });
})

export const signOut = createAction(AuthActions.SIGN_OUT, resolve => {
  return () => resolve();
})
