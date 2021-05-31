import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setHideSpyCountAction } from 'actions/config';
import { store } from 'store';

export const configHideSpyCountSelector = (state) => state.config.hideSpyCount ?? false;

export const getConfigHideSpyCount = () => configHideSpyCountSelector(store.getState());

export const useConfigHideSpyCount = () =>
  useSelectorAndDispatcher(configHideSpyCountSelector, setHideSpyCountAction);
