export const SELECT_LOCATION = 'CONFIG_SELECT_LOCATION';
export const DESELECT_LOCATION = 'CONFIG_DESELECT_LOCATION';
export const SELECT_ALL_LOCATIONS = 'CONFIG_SELECT_ALL_LOCATIONS';
export const DESELECT_ALL_LOCATIONS = 'CONFIG_DESELECT_ALL_LOCATIONS';
export const CREATE_CUSTOM_LOCATION = 'CONFIG_CREATE_CUSTOM_LOCATION';
export const SAVE_CUSTOM_LOCATION = 'CONFIG_SAVE_CUSTOM_LOCATION';
export const REM_CUSTOM_LOCATION = 'CONFIG_REM_CUSTOM_LOCATION';
export const SET_CUSTOM_LOCATIONS = 'SET_CUSTOM_LOCATIONS';
export const SET_SELECTED_LOCATIONS = 'SET_SELECTED_LOCATIONS';
export const ADD_PLAYER = 'CONFIG_ADD_PLAYER';
export const REM_PLAYER = 'CONFIG_REM_PLAYER';
export const UPDATE_PLAYER = 'CONFIG_UPDATE_PLAYER';
export const SET_TIME = 'CONFIG_SET_TIME';
export const SET_SPY_COUNT = 'CONFIG_SET_SPY_COUNT';

export const selectLocationAction = (locationId) => ({
  type: SELECT_LOCATION,
  payload: locationId,
});

export const deselectLocationAction = (locationId) => ({
  type: DESELECT_LOCATION,
  payload: locationId,
});

export const selectAllLocationsAction = (locationIds) => ({
  type: SELECT_ALL_LOCATIONS,
  payload: locationIds,
});

export const deselectAllLocationsAction = (locationIds) => ({
  type: DESELECT_ALL_LOCATIONS,
  payload: locationIds,
});

export const createCustomLocationAction = () => ({
  type: CREATE_CUSTOM_LOCATION,
});

export const saveCustomLocationAction = (id, location) => ({
  type: SAVE_CUSTOM_LOCATION,
  payload: {id, location},
});

export const remCustomLocationAction = (id) => ({
  type: REM_CUSTOM_LOCATION,
  payload: id,
});

export const setCustomLocations = (customLocations) => ({
  type: SET_CUSTOM_LOCATIONS,
  payload: customLocations,
});

export const setSelectedLocations = (selectedLocations) => ({
  type: SET_SELECTED_LOCATIONS,
  payload: selectedLocations,
});

export const addPlayerAction = () => ({
  type: ADD_PLAYER,
});

export const remPlayerAction = () => ({
  type: REM_PLAYER,
});

export const updatePlayerAction = (playerIndex, player) => ({
  type: UPDATE_PLAYER,
  payload: {playerIndex, player},
});

export const setTimeAction = (time) => ({
  type: SET_TIME,
  payload: time,
});

export const setSpyCountAction = (spyCount) => ({
  type: SET_SPY_COUNT,
  payload: spyCount,
});
