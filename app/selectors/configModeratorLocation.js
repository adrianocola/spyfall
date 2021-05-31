import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setModeratorLocationAction } from 'actions/config';
import { store } from 'store';

export const configModeratorLocationSelector = (state) => state.config.moderatorLocation;

export const getConfigModeratorLocation = () => configModeratorLocationSelector(store.getState());

export const useConfigModeratorLocation = () =>
  useSelectorAndDispatcher(configModeratorLocationSelector, setModeratorLocationAction);
