import * as React from 'react';
import { LocaleProvider, Divider } from 'antd';
import { Provider } from 'react-redux';
import { Route, Link, Router, Switch } from 'react-router-dom';
import ru from 'antd/es/locale-provider/ru_RU';
import PersonsTableContainer from './containers/PersonsTableContainer';
import FilterableFetchsContainer from './containers/FetchsTableContainer';
import SignInFormContainer from './containers/SignInFormContainer';
import SignUpFormContainer from './containers/SignUpFormContainer';
import Home from './components/Home/Home';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
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
  persons: '/persons',
  fetch: '/fetch',
}

const browserHistory = createBrowserHistory()
const store: Store<RootState> = configureStore(browserHistory)

export default () => (
  <LocaleProvider locale={ru} >
    <Provider store={store}>
      <Router history={browserHistory}>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', width: '100%', marginTop: 20 }}>
          <ul style={{ display: 'flex', listStyle: 'none' }}>
            <li><Link to='/'>Home</Link></li>
            <Divider type='vertical' style={{ marginTop: 5 }} />
            <li><Link to='/persons'>Persons</Link></li>
            <Divider type='vertical' style={{ marginTop: 5 }} />
            <li><Link to='/fetch'>Fetch</Link></li>
          </ul>
          <Divider style={{ marginTop: 0 }} />
          <main style={{ display: 'flex', justifyContent: 'center', margin: '0 50px' }}>
            <Switch>
              <Route path={Path.signin} component={SignInFormContainer} />
              <Route path={Path.signup} component={SignUpFormContainer} />

              <ProtectedRoute exact path={Path.root} component={Home} />
              <ProtectedRoute path={Path.fetch} component={FilterableFetchsContainer} />
              <ProtectedRoute path={Path.persons} component={PersonsTableContainer} />
            </Switch>
          </main>
        </div>
      </Router>
    </Provider>
  </LocaleProvider>
)