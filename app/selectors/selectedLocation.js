import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deselectLocationAction, selectLocationAction } from 'actions/config';
import { selectedLocationsSelector } from './selectedLocations';

export const useSelectedLocation = (locationId) => {
  const dispatch = useDispatch();
  const selectedLocations = useSelector(selectedLocationsSelector);
  const selected = selectedLocations[locationId] ?? false;

  const selectLocation = useCallback(() => {
    dispatch(selectLocationAction(locationId));
  }, [dispatch, locationId]);
  const deselectLocation = useCallback(() => {
    dispatch(deselectLocationAction(locationId));
  }, [dispatch, locationId]);

  return { selected, selectLocation, deselectLocation };
};
