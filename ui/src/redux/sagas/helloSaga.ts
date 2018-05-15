import { take } from 'redux-saga/effects';
import {
  CounterKeys
} from '../counter/types';

export function* helloSaga(): IterableIterator<any> {
  console.log('Hello Saga run');

  while (true) {
    const action = yield take([
      CounterKeys.INCREMENT,
      CounterKeys.DECREMENT
    ])
    if (action.type === CounterKeys.INCREMENT) {
      console.log('INCREMENT action');
    } else {
      console.log('DECREMENT action');
    }
  }
}