/// <reference path="../types/redux.d.ts" />
import { Store, createStore, applyMiddleware } from 'redux';
import { History } from 'history';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { RootState } from '@redux/rootReducer';
import rootSaga from '@redux/sagas/';

export default function configureStore(history: History, initialState?: RootState): Store<RootState> {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware, routerMiddleware(history)];

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

  sagaMiddleware.run(rootSaga);

  return store;

}