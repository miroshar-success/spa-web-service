import { Action } from 'redux';

// define initial state shape
export interface CounterState {
  value: number,
}

// define action types
export enum CounterKeys {
  INCREMENT = "@@counter/INCREMENT",
  DECREMENT = "@@counter/DECREMENT",
}

// declare actions types using interface
export interface IncrementAction extends Action {
  type: CounterKeys.INCREMENT,
}

export interface DecrementAction extends Action {
  type: CounterKeys.DECREMENT,
}

export type CounterActionTypes =
  | IncrementAction
  | DecrementAction