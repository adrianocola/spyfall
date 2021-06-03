import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setTimeAction } from 'actions/config';
import { store } from 'store';

export const configTimeSelector = (state) => state.config.time;

export const getConfigTime = () => configTimeSelector(store.getState());

export const useConfigTime = () =>
  useSelectorAndDispatcher(configTimeSelector, setTimeAction);
