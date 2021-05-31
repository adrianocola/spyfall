import { setSpyCountAction } from 'actions/config';
import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { store } from 'store';

export const configSpyCountSelector = (state) => state.config.spyCount;

export const getConfigSpyCount = () => configSpyCountSelector(store.getState());

export const useConfigSpyCount = () =>
  useSelectorAndDispatcher(configSpyCountSelector, setSpyCountAction);
