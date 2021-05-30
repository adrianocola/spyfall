import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setModeratorModeAction } from 'actions/config';

export const configModeratorModeSelector = (state) => state.config.moderatorMode;

export const useConfigModeratorMode = () =>
  useSelectorAndDispatcher(configModeratorModeSelector, setModeratorModeAction);
