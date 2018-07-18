import * as React from 'react';
import { LocaleProvider, Divider } from 'antd';
import { Provider } from 'react-redux';
import { Route, Link, BrowserRouter as Router, } from 'react-router-dom';
import ru from 'antd/es/locale-provider/ru_RU';

import BooksTableContainer from './containers/BooksTableContainer'

import { Store } from 'redux';
import configureStore from '@redux/store';
import { RootState } from '@redux/rootReducer';


export const Path = {
  root: '/',  
  book: '/book'
}

const store: Store<RootState> = configureStore()

export default () => (
  <LocaleProvider locale={ru} >
    <Provider store={store}>
      <Router>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', width: '100%', marginTop: 20 }}>
          <ul style={{ display: 'flex', listStyle: 'none' }}>
            <li><Link to='/'>Home</Link></li>
            <Divider
              style={{width: 0}} 
              type="vertical" />       
            <li><Link to='/book'>Book</Link></li>
            <Divider
              style={{width: 0}} 
              type="vertical"/>
          </ul>
          <Divider style={{ marginTop: 0 }} />
          <main style={{ display: 'flex', justifyContent: 'center', margin: '0 50px', flexDirection: 'row' }}>
            <Route exact path={Path.root} render={() => <h1>Home Page</h1>} />
            <Route path={Path.book} component={BooksTableContainer}/>            
          </main>
        </div>
      </Router>
    </Provider>
  </LocaleProvider>
)