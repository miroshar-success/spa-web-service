import * as React from 'react';
import { Alert } from 'antd';

export interface ErrorMessageProps {
  message: string;
}

export default ({ message }: ErrorMessageProps) => (
  <Alert type='error' message={message} />
)