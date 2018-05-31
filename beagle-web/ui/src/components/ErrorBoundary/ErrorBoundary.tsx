import * as React from 'react';
import Dropdown from './Dropdown';

import './errorBoundary.css';
const errorImg = require('../../../assets/images/error.png');

export interface ErrorInfo {
  componentStack: string,
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  error: Error | null | undefined;
  errorInfo: ErrorInfo | null;
}

/*
  Component that catch JavaScript errors anywhere in their child component tree and display a fallback UI. 
*/
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

  readonly state: ErrorBoundaryState = {
    error: null,
    errorInfo: null,
  };

  // Catch all errors here
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    const {
      error,
      errorInfo,
    } = this.state;

    const stackTrace = errorInfo &&
      errorInfo.componentStack.split('\n')
        .filter(Boolean)
        .map((item: any) => item.trim());

    return errorInfo ? (
      <div style={{ width: 800, margin: '0 auto' }}>
        <div style={{ width: 450, margin: '0 auto' }}>
          <img src={errorImg} alt="Application error" />
          <p className='ErrorBoundary-error-message'>Opps! Something went wrong</p>
        </div>
        <Dropdown
          error={error}
          stackTrace={stackTrace}
        />
      </div>
    ) : this.props.children
  }

}