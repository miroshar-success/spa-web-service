import { ActionCreator } from 'redux';
import {
  IncrementAction,
  DecrementAction,
  CounterKeys,
} from './types';

export const increment: ActionCreator<IncrementAction> = () => ({
  type: CounterKeys.INCREMENT
})

export const decrement: ActionCreator<DecrementAction> = () => ({
  type: CounterKeys.DECREMENT
})