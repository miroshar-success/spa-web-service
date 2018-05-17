import * as React from 'react';
import { LocaleProvider, Divider } from 'antd';
import { Provider } from 'react-redux';
import { Route, Link, BrowserRouter as Router, } from 'react-router-dom';
import ru from 'antd/es/locale-provider/ru_RU';
import PersonsTableContainer from './containers/PersonsTableContainer';

import { Store } from 'redux';
import configureStore from '@redux/store';
import { RootState } from '@redux/rootReducer';

// Available pathes
export const Path = {
  root: '/',
  persons: '/persons',
  fetch: '/fetch',
}

const store: Store<RootState> = configureStore()

export default () => (
  <LocaleProvider locale={ru} >
    <Provider store={store}>
      <Router>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', marginTop: 20 }}>
          <ul style={{ display: 'flex', listStyle: 'none' }}>
            <li><Link to='/'>Home</Link></li>
            <Divider type='vertical' style={{ marginTop: 5 }} />
            <li><Link to='/persons'>Persons</Link></li>
            <Divider type='vertical' style={{ marginTop: 5 }} />
            <li><Link to='/fetch'>Fetch</Link></li>
          </ul>
          <Divider style={{ marginTop: 0 }} />
          <main style={{ display: 'flex', justifyContent: 'center' }}>
            <Route exact path={Path.root} render={() => <h1>Home Page</h1>} />
            <Route path={Path.persons} component={PersonsTableContainer} />
            <Route path={Path.fetch} render={() => <h1>Fetch Component</h1>} />
          </main>
        </div>
      </Router>
    </Provider>
  </LocaleProvider>
)