import roomIdGenerator from 'services/roomIdGenerator';

import {
  REFRESH_ROOM_ID,
} from 'actions/room';

const initialState = {
  id: roomIdGenerator(),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REFRESH_ROOM_ID:
      return { ...state, id: roomIdGenerator() };
    default: return state;
  }
};
