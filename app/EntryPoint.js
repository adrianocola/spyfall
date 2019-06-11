import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';

import App from 'containers/App/App';

export const RootComponent = (props) => (
  <Provider store={props.store}>
    <PersistGate loading={null} persistor={props.persistor}>
      <Router history={props.history}>
        <ScrollToTop>
          <Switch>
            <Route component={App} />
          </Switch>
        </ScrollToTop>
      </Router>
    </PersistGate>
  </Provider>
);

export default hot(RootComponent);
