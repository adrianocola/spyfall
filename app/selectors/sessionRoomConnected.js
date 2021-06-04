import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setRoomConnectedAction } from 'actions/session';

export const roomConnectedSelector = (state) => state.session.roomConnected ?? false;

export const useRoomConnected = () =>
  useSelectorAndDispatcher(roomConnectedSelector, setRoomConnectedAction);
