import _ from 'lodash';
import { createSelector } from 'reselect';

const getSelectedLocations = (state) => state.config.selectedLocations;

export default createSelector(
  getSelectedLocations,
  (selectedLocations) => _.size(selectedLocations),
);
