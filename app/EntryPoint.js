import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';

import App from 'containers/App/App';

export const RootComponent = (props) => (
  <Provider store={props.store}>
    <PersistGate loading={null} persistor={props.persistor}>
      <ConnectedRouter history={props.history}>
        <ScrollToTop>
          <Switch>
            <Route component={App} />
          </Switch>
        </ScrollToTop>
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);

export default hot(module)(RootComponent);
