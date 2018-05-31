import * as React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import configureStore from '@redux/store';
import { RootState } from '@redux/rootReducer';

import { LocaleProvider } from 'antd';
import ru from 'antd/es/locale-provider/ru_RU';

import Navigation from '@components/Navigation/Navigation';
import renderRoutes from '@components/Routes/Routes';

const browserHistory = createBrowserHistory()
const store: Store<RootState> = configureStore(browserHistory)

export default () => (
  <LocaleProvider locale={ru} >
    <Provider store={store}>
      <Router history={browserHistory}>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', width: '100%', marginTop: 20 }}>
          <Navigation />
          {renderRoutes()}
        </div>
      </Router>
    </Provider>
  </LocaleProvider>
)