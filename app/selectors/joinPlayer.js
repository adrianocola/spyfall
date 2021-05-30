import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setJoinPlayerAction } from 'actions/joinRoom';

export const joinPlayerSelector = (state) => state.joinRoom.player;

export const useJoinPlayer = () =>
  useSelectorAndDispatcher(joinPlayerSelector, setJoinPlayerAction);
