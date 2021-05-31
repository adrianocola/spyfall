import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setSelectedLocations } from 'actions/config';

export const selectedLocationsSelector = (state) => state.config.selectedLocations;

export const useSelectedLocations = () =>
  useSelectorAndDispatcher(selectedLocationsSelector, setSelectedLocations);
