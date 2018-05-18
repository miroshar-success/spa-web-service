import * as React from 'react';
import { LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import ru from 'antd/es/locale-provider/ru_RU';
// import { BrowserRouter as Router, } from 'react-router-dom'
// import LoginForm from './components/LoginForm/LoginForm'
// import CounterContainer from './containers/CounterContainer';
import PersonsTableContainer from './containers/PersonsTableContainer';

import { Store } from 'redux';
import configureStore from '@redux/store';
import { RootState } from '@redux/rootReducer';

// Available pathes
export const Path = {

}

/*
  We give each route a target component.
  The <Switch> will iterate over its children elements (the routes) 
  and only render the first one that matches the current pathname.
*/
// export default () => (
//   <LocaleProvider locale={ru} >
//     <Router>
//       <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
//         <LoginForm />
//       </div>
//     </Router>
//   </LocaleProvider>
// )

const store: Store<RootState> = configureStore()

export default () => (
  <LocaleProvider locale={ru} >
    <Provider store={store}>
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
        {/* <LoginForm /> */}
        <PersonsTableContainer />
      </div>
    </Provider>
  </LocaleProvider>
)