import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setAutoStarTimerAction } from 'actions/config';

export const configAutoStartTimerSelector = (state) => state.config.autoStartTimer;

export const useConfigAutoStartTimer = () =>
  useSelectorAndDispatcher(configAutoStartTimerSelector, setAutoStarTimerAction);
