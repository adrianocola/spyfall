import _ from 'lodash';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { DEFAULT_LOCATIONS } from 'consts';
import { selectedLocationsSelector } from './selectedLocations';
import { customLocationsSelector } from './customLocations';

export const gameLocationsSelector = createSelector(
  [selectedLocationsSelector, customLocationsSelector],
  (selectedLocations, customLocations) => {
    const gameLocations = {};
    _.forEach(selectedLocations, (included, locationId) => {
      const location = DEFAULT_LOCATIONS[locationId] ? locationId : customLocations[locationId];
      if (location) {
        gameLocations[locationId] = DEFAULT_LOCATIONS[locationId] ? locationId : customLocations[locationId];
      }
    });
    return gameLocations;
  },
);

export const useGameLocations = () =>
  useSelector(gameLocationsSelector);
