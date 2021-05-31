import _ from 'lodash';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import root from 'reducers/root';
import session from 'reducers/session';
import game from 'reducers/game';
import config from 'reducers/config';
import room from 'reducers/room';
import joinRoom from 'reducers/joinRoom';

const middlewares = [];

const migrations = {
  0: (state) => state,
  1: (state) => {
    const players = _.map(state.config.players, (name) => ({ name }));
    return {
      ...state,
      config: {
        ...state.config,
        players,
      },
    };
  },
};

const persistConfig = {
  key: 'persistor',
  version: 1,
  storage,
  blacklist: ['session', 'game'],
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migrations, { debug: false }),
};

/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // TODO Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
      // Prevent recomputing reducers for `replaceReducer`
      shouldHotReload: false,
    })
    : compose;
/* eslint-enable */

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
  // other store enhancers if any
);

const persistedReducer = persistReducer(persistConfig, combineReducers({
  root,
  session,
  game,
  config,
  room,
  joinRoom,
}));

export const store = createStore(persistedReducer, {}, enhancer);
export const persistor = persistStore(store);
export default { store, persistor };
