import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setModeratorModeAction } from 'actions/config';
import { store } from 'store';

export const configModeratorModeSelector = (state) => state.config.moderatorMode ?? false;

export const getConfigModeratorMode = () => configModeratorModeSelector(store.getState());

export const useConfigModeratorMode = () =>
  useSelectorAndDispatcher(configModeratorModeSelector, setModeratorModeAction);
