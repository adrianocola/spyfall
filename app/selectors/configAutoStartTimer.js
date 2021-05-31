import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setAutoStarTimerAction } from 'actions/config';
import { store } from 'store';

export const configAutoStartTimerSelector = (state) => state.config.autoStartTimer ?? false;

export const getConfigAutoStartTimer = () => configAutoStartTimerSelector(store.getState());

export const useConfigAutoStartTimer = () =>
  useSelectorAndDispatcher(configAutoStartTimerSelector, setAutoStarTimerAction);
