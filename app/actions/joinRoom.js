export const SET_ROOM_ID = 'JOIN_ROOM_SET_ROOM_ID';
export const SET_PLAYER_ID = 'JOIN_ROOM_SET_PLAYER_ID';

export const setJoinRoomIdAction = (roomId) => ({
  type: SET_ROOM_ID,
  payload: roomId,
});

export const setJoinPlayerAction = (player) => ({
  type: SET_PLAYER_ID,
  payload: player,
});
