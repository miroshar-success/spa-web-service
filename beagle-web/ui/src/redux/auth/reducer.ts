import { AuthActions, Roles, AuthState } from './types';
import { RootState } from '@redux/rootReducer';

const initialState: AuthState = {
  userDetails: {
    name: null,
    role: Roles.USER,
    authorized: false,
  },
  error: '',
  loading: false,
}

export function authReducer(state: AuthState = initialState, action: any) {
  switch (action.type) {
    case AuthActions.SIGN_OUT:
    case AuthActions.SIGN_IN:
    case AuthActions.SIGN_UP: {
      return {
        ...state,
        loading: true,
        error: '',
      }
    }
    case AuthActions.SIGN_UP_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: '',
      }
    }
    case AuthActions.SIGN_IN_SUCCESS: {
      const { userDetails } = action.payload;
      return {
        ...state,
        userDetails,
        loading: false,
        error: '',
      }
    }
    case AuthActions.SIGN_OUT_SUCCESS: {
      return {
        ...state,
        ...initialState,
      }
    }
    case AuthActions.SIGN_OUT_FAILURE:
    case AuthActions.SIGN_IN_FAILURE:
    case AuthActions.SIGN_UP_FAILURE: {
      const { error } = action.payload;
      return {
        ...state,
        loading: false,
        error,
      }
    }
    case AuthActions.GET_CURRENT_USER_SUCCESS: {
      const { userDetails } = action.payload;
      return {
        ...state,
        error: '',
        userDetails,
      }
    }
    default: return state;
  }

}

// selectors
export const getUserDetails = (state: RootState) => state.auth.userDetails;
export const getErrorMessage = (state: RootState) => state.auth.error;
export const getLoadingStatus = (state: RootState) => state.auth.loading;