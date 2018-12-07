import React from 'react';
import { Provider } from 'mobx-react';
import { create } from 'mobx-persist';
import { removeItem } from 'mobx-persist/lib/storage';
import { Collection, Document } from 'firestorter';

import SpinnerModal from 'components/SpinnerModal/SpinnerModal';
import rootStore from 'stores/rootStore';
import configStore from 'stores/configStore';
import gameStore from 'stores/gameStore';

const APP_NAME = 'ensemble-template';

const stores = {
  rootStore,
  configStore,
  gameStore,
};

const storeKeyName = (storeName) => `${APP_NAME}-${storeName}`;

export const clear = () => {
  const promises = [];
  Object.keys(stores).forEach((storeName) => {
    removeItem(storeKeyName(storeName));
  });

  return Promise.all(promises);
};

export default class Store extends React.PureComponent{
  constructor(props) {
    super(props);

    this.state = {hydrated: false};
    this.hydrate();
  }

  hydrate = async () => {
    const promises = [];
    Object.entries(stores).forEach(([storeName, store]) => {
      // ignora objetos do firestorter
      if(store instanceof Collection || store instanceof Document) return;
      const hydrate = create();
      promises.push(hydrate(storeKeyName(storeName), store));
    });

    await Promise.all(promises);
    this.setState({hydrated: true});
  };

  render() {
    if(!this.state.hydrated) return this.props.loading || <SpinnerModal />;
    return (
      <Provider {...stores}>
        {this.props.children}
      </Provider>
    );
  }
}
