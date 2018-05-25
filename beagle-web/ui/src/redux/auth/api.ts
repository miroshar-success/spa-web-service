import axios from 'axios';
import { SignInUser, SignUpUser } from './types'

export const signUp = (user: SignUpUser) => {
  return axios.post('/beagle-web/auth/signup', { ...user })
}

export const signIn = (user: SignInUser) => {
  return axios.post('/beagle-web/auth/signin', { ...user });
}