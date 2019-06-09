import {
  SET_USER_ID,
  SET_LANGUAGE,
  SET_IMPORTED_LEGACY,
} from 'actions/root';

const initialState = {
  userId: null,
  language: 'en-US',
  importedLegacy: false,
};

export default (state = initialState, action) => {
  switch(action.type){
    case SET_USER_ID:
      return {...state, userId: action.payload};
    case SET_LANGUAGE:
      return {...state, language: action.payload};
    case SET_IMPORTED_LEGACY:
      return {...state, importedLegacy: action.payload};
    default: return state;
  }
};
