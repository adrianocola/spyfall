import {
  SET_ROOM_ID,
  SET_PLAYER_ID,
} from 'actions/joinRoom';

const initialState = {
  roomId: '',
  player: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ROOM_ID:
      return { ...state, roomId: (action.payload || '').toUpperCase() };
    case SET_PLAYER_ID:
      return { ...state, player: (action.payload || '').toUpperCase() };
    default: return state;
  }
};
