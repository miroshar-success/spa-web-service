import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ErrorBoundary from './components/Book/ErrorBoundary/ErrorBoundary';
import Root from './Root';

ReactDOM.render(
  <ErrorBoundary>
    <Root />
  </ErrorBoundary>
  , document.getElementById('root') as HTMLElement)