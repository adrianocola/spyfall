import _ from 'lodash';
import { createSelector } from 'reselect';
import { DEFAULT_LOCATIONS } from 'consts';
import { useSelector } from 'react-redux';

const getCustomLocations = (state) => state.config.customLocations;

const totalLocationsCountSelector = createSelector(
  getCustomLocations,
  (customLocations) => _.size(DEFAULT_LOCATIONS) + _.size(customLocations),
);

export const useTotalLocationsCount = () =>
  useSelector(totalLocationsCountSelector);
