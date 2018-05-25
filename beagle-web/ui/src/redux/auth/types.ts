export enum AuthActions {
  SIGN_UP = 'SIGN_UP',
  SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS',
  SIGN_UP_FAILURE = 'SIGN_UP_FAILURE',

  SIGN_IN = 'SIGN_IN',
  SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS',
  SIGN_IN_FAILURE = 'SIGN_IN_FAILURE',

  SIGN_OUT = 'SIGN_OUT',
  SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS',
  SIGN_OUT_FAILURE = 'SIGN_OUT_FAILURE'
}

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface SignInUser {
  email: string;
  password: string;
}

export interface SignUpUser extends SignInUser {
  name: string;
}