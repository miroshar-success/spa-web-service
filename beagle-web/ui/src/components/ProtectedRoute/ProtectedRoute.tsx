import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { getUserDetails } from '@redux/auth/reducer';
import { UserDetails } from '@redux/auth/types';
import { getCurrentUser, redirectToLoginPage } from '@redux/auth/actions';

export class TokenManager {

  static setToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  static getToken() {
    return localStorage.getItem('access_token');
  }
}

const secure = <P extends object>(Component: React.ComponentType<P>) => {

  interface AuthProps {
    userDetails: UserDetails;
    getCurrentUser: Function;
    redirectToLoginPage: Function;
  }

  class Auth extends React.Component<P & AuthProps> {

    componentWillMount() {
      const {
        userDetails
      } = this.props;

      this.checkAuth(userDetails);
    }

    componentWillReceiveProps(nextProps: P & AuthProps) {
      const {
        userDetails
      } = nextProps;

      this.checkAuth(userDetails);
    }

    checkAuth = (userDetails: UserDetails) => {
      const {
        getCurrentUser,
        redirectToLoginPage,
      } = this.props;

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

export default secure;