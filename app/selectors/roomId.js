import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { refreshRoomId } from 'actions/room';

export const roomIdSelector = (state) => state.room.id;

export const useRoomId = () =>
  useSelectorAndDispatcher(roomIdSelector, refreshRoomId);
