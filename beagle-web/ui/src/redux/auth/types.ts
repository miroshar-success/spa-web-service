export enum AuthActions {
  SIGN_UP = 'SIGN_UP',
  SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS',
  SIGN_UP_FAILURE = 'SIGN_UP_FAILURE',

  SIGN_IN = 'SIGN_IN',
  SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS',
  SIGN_IN_FAILURE = 'SIGN_IN_FAILURE',

  SIGN_OUT = 'SIGN_OUT',
  SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS',
  SIGN_OUT_FAILURE = 'SIGN_OUT_FAILURE',

  GET_CURRENT_USER = 'GET_CURRENT_USER',
  GET_CURRENT_USER_SUCCESS = 'GET_CURRENT_USER_SUCCESS',
  GET_CURRENT_USER_FAILURE = 'GET_CURRENT_USER_FAILURE',

  REDIRECT_TO_LOGIN_PAGE = 'REDIRECT_TO_LOGIN_PAGE',
  INIT_WEBSOCKET = 'INIT_WEBSOCKET',
}

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// auth state shape

export interface AuthState {
  readonly userDetails: UserDetails;
  readonly error: string;
  readonly loading: boolean;
}

// models

export interface SignInUser {
  email: string;
  password: string;
}

export interface SignUpUser extends SignInUser {
  name: string;
}

export interface UserDetails {
  name: string | null;
  authorized: boolean;
  role: Roles;
}


// action creators return type signature

export type SignInSignature = {
  (user: SignInUser): object
}

export type SignUpSignature = {
  (user: SignUpUser): object
}