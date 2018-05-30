import * as React from 'react';
import { LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import ru from 'antd/es/locale-provider/ru_RU';
import PersonsTableContainer from './containers/PersonsTableContainer';
import FilterableFetchsContainer from './containers/FetchsTableContainer';
import SignInFormContainer from './containers/SignInFormContainer';
import SignUpFormContainer from './containers/SignUpFormContainer';
import UserFetchsTableContainer from './containers/UserFetchsTableContainer';
import Home from './components/Home/Home';
import Navigation from './components/Navigation/Navigation';

import secure from './components/ProtectedRoute/ProtectedRoute';

import { createBrowserHistory } from 'history';
import { Store } from 'redux';
import configureStore from '@redux/store';
import { RootState } from '@redux/rootReducer';

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

const browserHistory = createBrowserHistory()
const store: Store<RootState> = configureStore(browserHistory)

export default () => (
  <LocaleProvider locale={ru} >
    <Provider store={store}>
      <Router history={browserHistory}>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', width: '100%', marginTop: 20 }}>
          <Navigation />
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
        </div>
      </Router>
    </Provider>
  </LocaleProvider>
)