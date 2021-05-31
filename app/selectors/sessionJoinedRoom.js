import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setJoinedRoomAction } from 'actions/session';

export const sessionJoinedRoomSelector = (state) => state.session.joinedRoom;

export const useJoinedRoom = () =>
  useSelectorAndDispatcher(sessionJoinedRoomSelector, setJoinedRoomAction);
