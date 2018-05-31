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
  readonly userDetails: Models.UserDetails;
  readonly error: string;
  readonly loading: boolean;
}

// models

export namespace Models {

  export interface SignInUser {
    email: string;
    password: string;
  }

  export interface SignUpUser extends SignInUser {
    name: string;
  }

  export interface UserDetails {
    name: string;
    authorized: boolean;
    role: Roles;
  }

}


// action creators return type signature

export namespace Signatures {

  export type SignIn = {
    (user: Models.SignInUser): object
  }

  export type SignUp = {
    (user: Models.SignUpUser): object
  }

  export type GetCurrentUser = {
    (): object
  }

  export type RedirectToLoginPage = {
    (): object
  }

}