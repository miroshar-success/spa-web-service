import { createAction } from 'typesafe-actions';
import { Signatures, Models, AuthActions } from './types';

// sign up

export const signUp: Signatures.SignUp = createAction(AuthActions.SIGN_UP, resolve => {
  return (user: Models.SignUpUser) => resolve({ user });
})

export const signUpSuccess = createAction(AuthActions.SIGN_UP_SUCCESS, resolve => {
  return () => resolve();
})

export const signUpFailure = createAction(AuthActions.SIGN_UP_FAILURE, resolve => {
  return (error: string) => resolve({ error });
})

// sign in

export const signIn: Signatures.SignIn = createAction(AuthActions.SIGN_IN, resolve => {
  return (user: Models.SignInUser) => resolve({ user });
})

export const signInSuccess = createAction(AuthActions.SIGN_IN_SUCCESS, resolve => {
  return (userDetails: Models.UserDetails) => resolve({ userDetails })
})

export const signInFailure = createAction(AuthActions.SIGN_IN_FAILURE, resolve => {
  return (error: string) => resolve({ error });
})

// sign out

export const signOut = createAction(AuthActions.SIGN_OUT, resolve => {
  return () => resolve();
})

// get current user

export const getCurrentUser: Signatures.GetCurrentUser = createAction(AuthActions.GET_CURRENT_USER, resolve => {
  return () => resolve();
})

export const getCurrentUserSuccess = createAction(AuthActions.GET_CURRENT_USER_SUCCESS, resolve => {
  return (userDetails: Models.UserDetails) => resolve({ userDetails });
})

export const getCurrentUserFailure = createAction(AuthActions.GET_CURRENT_USER_FAILURE, resolve => {
  return (error: string) => resolve({ error });
})

// redirect

export const redirectToLoginPage = createAction(AuthActions.REDIRECT_TO_LOGIN_PAGE, resolve => {
  return () => resolve();
})

// init websocket
export const initWebsocket = createAction(AuthActions.INIT_WEBSOCKET, resolve => {
  return () => resolve();
})