import { hot } from 'react-hot-loader/root';
import React, { useEffect } from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { logPageView } from 'utils/analytics';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';

import App from 'containers/App/App';

export const RootComponent = ({ history, store, persistor }) => {
  useEffect(() => {
    return history.listen((location) => {
      logPageView(location.pathname + location.search);
    });
  }, [history]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router history={history}>
          <ScrollToTop>
            <Switch>
              <Route component={App} />
            </Switch>
          </ScrollToTop>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default hot(RootComponent);
