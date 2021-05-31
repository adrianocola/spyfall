import {
  SET_USER_ID,
  SET_LANGUAGE,
  SET_TRANSLATIONS,
} from 'actions/root';

const initialState = {
  userId: null,
  language: 'en-US',
  translations: {},
  translationsImportTime: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_ID:
      return { ...state, userId: action.payload };
    case SET_LANGUAGE:
      return { ...state, language: action.payload };
    case SET_TRANSLATIONS:
      return { ...state, translations: action.payload, translationsImportTime: Date.now() };
    default: return state;
  }
};
