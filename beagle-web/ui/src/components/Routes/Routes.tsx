import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import PersonsTableContainer from '@containers/PersonsTableContainer';
import FilterableFetchsContainer from '@containers/FetchsTableContainer';
import SignInFormContainer from '@containers/SignInFormContainer';
import SignUpFormContainer from '@containers/SignUpFormContainer';
import UserFetchsTableContainer from '@containers/UserFetchsTableContainer';

import Home from '@components/Home/Home';
import secure from '@components/ProtectedRoute/ProtectedRoute';

// Available pathes
export const Path = {
  root: '/',
  home: '/home',
  signin: '/signin',
  signup: '/signup',
  persons: '/a_persons',
  fetch: '/a_fetchs',
  userFetchs: '/u_fetchs',
}

const renderRoutes = () => (
  <React.Fragment>
    <main style={{ display: 'flex', justifyContent: 'center', margin: '0 50px' }}>
      <Switch>
        <Route path={Path.signin} component={SignInFormContainer} />
        <Route path={Path.signup} component={SignUpFormContainer} />
        <Route exact path={Path.root} component={secure(Home)} />
        <Route path={Path.fetch} component={secure(FilterableFetchsContainer)} />
        <Route path={Path.persons} component={secure(PersonsTableContainer)} />
        <Route path={Path.userFetchs} component={secure(UserFetchsTableContainer)} />
      </Switch>
    </main>
  </React.Fragment>
)

export default renderRoutes;