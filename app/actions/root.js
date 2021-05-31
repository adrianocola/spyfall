export const SET_USER_ID = 'ROOT_SET_USER_ID';
export const SET_LANGUAGE = 'ROOT_SET_LANGUAGE';
export const SET_TRANSLATIONS = 'SET_TRANSLATIONS';
export const setUserIdAction = (user) => ({
  type: SET_USER_ID,
  payload: user,
});

export const setLanguageAction = (language) => ({
  type: SET_LANGUAGE,
  payload: language,
});

export const setTranslationsAction = (translations) => ({
  type: SET_TRANSLATIONS,
  payload: translations,
});
