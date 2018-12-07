import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';

import App from 'containers/App/App';
import Store from './Store';

export class RootComponent extends React.PureComponent{
  render() {
    return (
      <Store loading={null}>
        <Router history={this.props.history}>
          <ScrollToTop>
            <Switch>
              <Route component={App} />
            </Switch>
          </ScrollToTop>
        </Router>
      </Store>
    );
  }
}

export default hot(module)(RootComponent);
