import { setSpyCountAction } from 'actions/config';
import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';

export const configSpyCountSelector = (state) => state.config.spyCount;

export const useConfigSpyCount = () =>
  useSelectorAndDispatcher(configSpyCountSelector, setSpyCountAction);
