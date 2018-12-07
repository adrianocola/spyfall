import {observable, action, computed} from 'mobx';
import { persist } from 'mobx-persist';
import shortid from 'shortid';
import { DEFAULT_LOCATIONS, DEFAULT_LOCATIONS_LENGTH } from 'consts';
import i18n from 'i18n';

class ConfigStore {
  @persist('object') @observable selectedLocations = Object.entries(DEFAULT_LOCATIONS).filter(([key, value]) => value === 1).reduce((obj, [key]) => {obj[key] = true; return obj}, {});
  @persist('object') @observable customLocations = {};

  @computed get gameLocations() {
    const gameLocations = {};
    this.selectedLocationsArray.forEach((locationId) => {
      gameLocations[locationId] = DEFAULT_LOCATIONS[locationId] ? locationId : this.customLocations[locationId];
    });
    return gameLocations;
  }

  @computed get selectedLocationsArray() {
    return Object.keys(this.selectedLocations);
  }

  @computed get selectedLocationsLength() {
    return this.selectedLocationsArray.length;
  }

  @computed get customLocationsArray() {
    return Object.keys(this.customLocations);
  }

  @computed get customLocationsLength() {
    return this.customLocationsArray.length;
  }

  @computed get totalLocationsLength() {
    return this.customLocationsLength + DEFAULT_LOCATIONS_LENGTH;
  }

  @action addToSelectedLocations(locationId) {
    this.selectedLocations[locationId] = true;
  }

  @action removeFromSelectedLocations(locationId) {
    delete this.selectedLocations[locationId];
  }

  @action addCustomLocation() {
    this.customLocations[shortid.generate()] = {
      name: i18n.t('interface.location'),
    };
  }

  @action saveCustomLocation(id, location) {
    this.customLocations[id] = location;
  }

  @action removeCustomLocation(id) {
    delete this.customLocations[id];
  }
}

export default new ConfigStore();
