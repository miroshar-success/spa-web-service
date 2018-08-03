import * as React from 'react';
import { LocaleProvider, Divider } from 'antd';
import { Provider } from 'react-redux';
import { Route, Link, BrowserRouter as Router, } from 'react-router-dom';
import ru from 'antd/es/locale-provider/ru_RU';

import BooksTableContainer from './containers/BooksTableContainer'
import AuthorTableContainer from './containers/AuthorTableContainer'

import { Store } from 'redux';
import configureStore from '@redux/store';
import { RootState } from '@redux/rootReducer';


export const Path = {
  root: '/',  
  books: '/books',
  authors: '/authors'
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
            <li><Link to='/books'>Books</Link></li>
            <Divider
              style={{width: 0}} 
              type="vertical"/>
          
          <li><Link to='/authors'>Authors</Link></li>
          <Divider
              style={{width: 0}} 
              type="vertical"/>
          </ul>
          <main style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
            <Route exact path={Path.root} 
                   render={() => <h1>
                                  <label style={{ marginLeft: 90 }}>
                                    Welcome to the EpolSoft Training Project
                                  </label> <br/><br/>
                                  <img src={require('./../assets/images/EpolSoft.png')} height="200px" />
                                 </h1>
                          }     
            />
            <Route path={Path.books} component={BooksTableContainer}/> 
            <Route path={Path.authors} component={AuthorTableContainer}/>            
          </main>
        </div>
      </Router>
    </Provider>
  </LocaleProvider>
)