import {
  CounterKeys,
  CounterState,
  CounterActionTypes,
} from './types'

import {
  RootState,
} from '../rootReducer'

export const initialState: CounterState = {
  value: 0,
}

function counterReducer(state: CounterState = initialState, action: CounterActionTypes) {
  switch (action.type) {
    case CounterKeys.INCREMENT: {
      return {
        ...state,
        value: state.value + 1,
      }
    }
    case CounterKeys.DECREMENT: {
      return {
        ...state,
        value: state.value - 1,
      }
    }
    default: return state;
  }
}

// selectors
export const getCounterValue = (state: RootState) => state.counter.value;

export default counterReducer;