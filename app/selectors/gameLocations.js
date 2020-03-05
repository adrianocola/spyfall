import _ from 'lodash';
import { createSelector } from 'reselect';
import { DEFAULT_LOCATIONS } from 'consts';

const getSelectedLocations = (state) => state.config.selectedLocations;
const getCustomLocations = (state) => state.config.customLocations;

export default createSelector(
  [getSelectedLocations, getCustomLocations],
  (selectedLocations, customLocations) => {
    const gameLocations = {};
    _.forEach(selectedLocations, (included, locationId) => {
      const location = DEFAULT_LOCATIONS[locationId] ? locationId : customLocations[locationId];
      if(location){
        gameLocations[locationId] = DEFAULT_LOCATIONS[locationId] ? locationId : customLocations[locationId];
      }
    });
    return gameLocations;
  },
);
