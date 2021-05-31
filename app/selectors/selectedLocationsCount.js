import _ from 'lodash';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';

const getSelectedLocations = (state) => state.config.selectedLocations;

const selectedLocationsSelector = createSelector(
  getSelectedLocations,
  (selectedLocations) => _.size(selectedLocations),
);

export const useSelectedLocationsCount = () =>
  useSelector(selectedLocationsSelector);
