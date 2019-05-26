import {
  SET_USER_ID,
  SET_LANGUAGE,
} from 'actions/root';

const initialState = {
  userId: null,
  language: 'en-US',
};

export default (state = initialState, action) => {
  switch(action.type){
    case SET_USER_ID:
      return {...state, userId: action.payload};
    case SET_LANGUAGE:
      return {...state, language: action.payload};
    default: return state;
  }
};
