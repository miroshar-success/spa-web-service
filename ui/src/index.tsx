import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from './Root';

ReactDOM.render(<Root/>, document.getElementById('root') as HTMLElement)