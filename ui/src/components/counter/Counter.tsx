import * as React from 'react';

export interface CounterProps {
  value: number;
  increment: () => any;
  decrement: () => any;
}

export const Counter: React.SFC<CounterProps> = (props) => {
  const {
    value,
    increment,
    decrement,
  } = props;

  return (
    <div>
      <button onClick={increment}>+</button>
      {'    '}
      <button onClick={decrement}>-</button>
      <br />
      <span>Current value: {value}</span>
    </div>
  )
}