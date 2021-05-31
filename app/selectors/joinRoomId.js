import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setJoinRoomIdAction } from 'actions/joinRoom';

export const joinRoomIdSelector = (state) => state.joinRoom.roomId;

export const useJoinRoomId = () =>
  useSelectorAndDispatcher(joinRoomIdSelector, setJoinRoomIdAction);
