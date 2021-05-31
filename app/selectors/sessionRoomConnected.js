import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setRoomConnectedAction } from 'actions/session';

export const roomConnectedSelector = (state) => state.session.roomConnected;

export const useRoomConnected = () =>
  useSelectorAndDispatcher(roomConnectedSelector, setRoomConnectedAction);
