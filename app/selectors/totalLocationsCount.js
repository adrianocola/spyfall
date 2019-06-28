import _ from 'lodash';
import { createSelector } from 'reselect';
import { DEFAULT_LOCATIONS } from 'consts';

const getCustomLocations = (state) => state.config.customLocations;

export default createSelector(
  getCustomLocations,
  (customLocations) => _.size(DEFAULT_LOCATIONS) + _.size(customLocations),
);
