import axios from 'axios';
import { SignInUser, SignUpUser } from './types'
import { TokenManager } from '@components/ProtectedRoute/ProtectedRoute';

export const signUp = (user: SignUpUser) => {
  return axios.post('/beagle-web/signup', { ...user })
}

export const signIn = (user: SignInUser) => {
  return axios.post('/beagle-web/auth/signin', { ...user });
}

export const getCurrentUser = () => {
  return axios.get('/beagle-web/auth/current', {
    headers: {
      Authorized: TokenManager.getToken()
    }
  });
}