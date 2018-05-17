/// <reference path="../types/redux.d.ts" />
import { Store, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { RootState } from '@redux/rootReducer';
// import {
//   helloSaga,
// } from './sagas/helloSaga';
import * as sagas from '@redux/sagas/';

export default function configureStore(initialState?: RootState): Store<RootState> {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];

  const composeEnhancers = composeWithDevTools({});

  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares)
  );

  const store = createStore(
    rootReducer,
    initialState!,
    enhancer,
  );

  if (module.hot) {
    module.hot.accept('@redux/rootReducer', () => {
      const nextRootReducer = require('@redux/rootReducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  sagaMiddleware.run(sagas.loadPersonsSaga);

  return store;

}