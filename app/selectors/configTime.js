import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setTimeAction } from 'actions/config';

export const configTimeSelector = (state) => state.config.time;

export const useConfigTime = () =>
  useSelectorAndDispatcher(configTimeSelector, setTimeAction);
