import { createAction } from 'typesafe-actions';
import * as AuthTypes from './types';

// sign up

export const signUp: AuthTypes.SignUpSignature = createAction(AuthTypes.AuthActions.SIGN_UP, resolve => {
  return (user: AuthTypes.SignUpUser) => resolve({ user });
})

export const signUpSuccess = createAction(AuthTypes.AuthActions.SIGN_UP_SUCCESS, resolve => {
  return () => resolve();
})

export const signUpFailure = createAction(AuthTypes.AuthActions.SIGN_UP_FAILURE, resolve => {
  return (error: string) => resolve({ error });
})

// sign in

export const signIn: AuthTypes.SignInSignature = createAction(AuthTypes.AuthActions.SIGN_IN, resolve => {
  return (user: AuthTypes.SignInUser) => resolve({ user });
})

export const signInSuccess = createAction(AuthTypes.AuthActions.SIGN_IN_SUCCESS, resolve => {
  return (userDetails: AuthTypes.UserDetails) => resolve({ userDetails })
})

export const signInFailure = createAction(AuthTypes.AuthActions.SIGN_IN_FAILURE, resolve => {
  return (error: string) => resolve({ error });
})

// sign out

export const signOut = createAction(AuthTypes.AuthActions.SIGN_OUT, resolve => {
  return () => resolve();
})

// get current user

export const getCurrentUser = createAction(AuthTypes.AuthActions.GET_CURRENT_USER, resolve => {
  return () => resolve();
})

export const getCurrentUserSuccess = createAction(AuthTypes.AuthActions.GET_CURRENT_USER_SUCCESS, resolve => {
  return (userDetails: AuthTypes.UserDetails) => resolve({ userDetails });
})

export const getCurrentUserFailure = createAction(AuthTypes.AuthActions.GET_CURRENT_USER_FAILURE, resolve => {
  return (error: string) => resolve({ error });
})

// redirect

export const redirectToLoginPage = createAction(AuthTypes.AuthActions.REDIRECT_TO_LOGIN_PAGE, resolve => {
  return () => resolve();
})

// init websocket
export const initWebsocket = createAction(AuthTypes.AuthActions.INIT_WEBSOCKET, resolve => {
  return () => resolve();
})