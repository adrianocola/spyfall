import { useDispatcher } from 'hooks/useDispatcher';
import { deselectAllLocationsAction, selectAllLocationsAction } from 'actions/config';

export const useSelectAll = () => {
  const selectAllLocations = useDispatcher(selectAllLocationsAction);
  const deselectAllLocations = useDispatcher(deselectAllLocationsAction);
  return { selectAllLocations, deselectAllLocations };
};
