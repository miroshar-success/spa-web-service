import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

export class TokenManager {

  static setToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  static getToken() {
    return localStorage.getItem('access_token');
  }
}

const ProtectedRoute = (props: any) => {
  const { component: Component, ...rest } = props;
  return (
    <Route {...rest} render={(props) =>
      TokenManager.getToken()
        ? <Component {...props} />
        : <Redirect to={{
          pathname: '/signin',
          state: {
            from: props.location,
          }
        }} />
    } />
  )
}

export default ProtectedRoute;