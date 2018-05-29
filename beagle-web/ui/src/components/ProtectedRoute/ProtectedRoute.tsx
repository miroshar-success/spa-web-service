import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { getUserDetails } from '@redux/auth/reducer';
import { getCurrentUser, redirectToLoginPage } from '@redux/auth/actions';

export class TokenManager {

  static setToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  static getToken() {
    return localStorage.getItem('access_token');
  }
}

export default function secure(Component: any) {
  class Auth extends React.Component<any> {

    componentWillMount() {
      const {
        redirectToLoginPage,
        getCurrentUser,
        userDetails
      } = this.props;

      this.checkAuth(redirectToLoginPage, getCurrentUser, userDetails);
    }

    componentWillReceiveProps(nextProps: any) {
      const {
        redirectToLoginPage,
        getCurrentUser,
        userDetails
      } = nextProps;

      this.checkAuth(redirectToLoginPage, getCurrentUser, userDetails);
    }

    checkAuth = (redirectToLoginPage: Function, getCurrentUser: Function, userDetails: any) => {
      if (!TokenManager.getToken()) {
        redirectToLoginPage();
      } else if (!userDetails.authorized) {
        getCurrentUser();
      }
    }

    render() {
      if (this.props.userDetails.authorized) {
        return <Component {...this.props} />
      }
      return null;
    }
  }

  const mapStateToProps = (state: RootState) => ({
    userDetails: getUserDetails(state),
  })

  return connect(mapStateToProps, { getCurrentUser, redirectToLoginPage })(Auth);
}