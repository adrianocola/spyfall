import shortid from 'shortid';
import i18n from 'i18n';
import roomIdGenerator from 'services/roomIdGenerator';
import {DEFAULT_LOCATIONS} from 'consts';
import {
  ADD_PLAYER,
  CREATE_CUSTOM_LOCATION,
  DESELECT_ALL_LOCATIONS,
  DESELECT_LOCATION,
  REM_CUSTOM_LOCATION,
  REM_PLAYER,
  SAVE_CUSTOM_LOCATION,
  SET_CUSTOM_LOCATIONS,
  SET_SELECTED_LOCATIONS,
  SELECT_ALL_LOCATIONS,
  SELECT_LOCATION,
  SET_SPY_COUNT,
  SET_TIME,
  UPDATE_PLAYER,
} from 'actions/config';

const defaultSelectedLocations = Object.entries(DEFAULT_LOCATIONS).filter(([key, value]) => value === 1).reduce((obj, [key]) => {obj[key] = true; return obj}, {});

const initialState = {
  selectedLocations: defaultSelectedLocations,
  customLocations: {},
  roomId: roomIdGenerator(),
  players: ['P1'],
  time: 480,
  spyCount: 1,
};

export default (state = initialState, action) => {
  switch(action.type){
    case SELECT_LOCATION:
      return {
        ...state,
        selectedLocations: {
          ...state.selectedLocations,
          [action.payload]: true,
        },
      };
    case DESELECT_LOCATION: {
      const selectedLocations = {...state.selectedLocations};
      delete selectedLocations[action.payload];
      return {...state, selectedLocations};
    }
    case SELECT_ALL_LOCATIONS: {
      const selectedLocations = {...state.selectedLocations};
      action.payload.forEach((locationId) => {
        selectedLocations[locationId] = true;
      });
      return {...state, selectedLocations};
    }
    case DESELECT_ALL_LOCATIONS: {
      const selectedLocations = {...state.selectedLocations};
      action.payload.forEach((locationId) => {
        delete selectedLocations[locationId];
      });
      return {...state, selectedLocations};
    }
    case CREATE_CUSTOM_LOCATION:
      return {
        ...state,
        customLocations: {
          ...state.customLocations,
          [shortid.generate()]: {
            name: i18n.t('interface.location'),
          },
        },
      };
    case SAVE_CUSTOM_LOCATION:
      return {
        ...state,
        customLocations: {
          ...state.customLocations,
          [action.payload.id]: action.payload.location,
        },
      };
    case SET_CUSTOM_LOCATIONS:
      return {
        ...state,
        customLocations: action.payload,
      };
    case SET_SELECTED_LOCATIONS:
      return {
        ...state,
        selectedLocations: action.payload,
      };
    case REM_CUSTOM_LOCATION: {
      const customLocations = {...state.customLocations};
      const selectedLocations = {...state.selectedLocations};
      delete customLocations[action.payload];
      delete selectedLocations[action.payload];
      return {...state, customLocations, selectedLocations};
    }
    case ADD_PLAYER: {
      const players = [...state.players, `P${state.players.length + 1}`];
      return {
        ...state,
        players,
      };
    }
    case REM_PLAYER: {
      const players = state.players.slice(0, -1);
      return {
        ...state,
        players,
      };
    }
    case UPDATE_PLAYER:
      return {
        ...state,
        players: [
          ...state.players.slice(0, action.payload.playerIndex),
          action.payload.player,
          ...state.players.slice(action.payload.playerIndex + 1),
        ],
      };
    case SET_TIME:
      return {...state, time: action.payload};
    case SET_SPY_COUNT:
      return {...state, spyCount: action.payload};
    default: return state;
  }
};
