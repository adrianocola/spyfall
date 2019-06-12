import { store } from 'store';
import { resetGameAction, updateGameAction } from 'actions/game';
import {database, databaseServerTimestamp} from 'services/firebase';
import gameLocationsSelector from 'selectors/gameLocations';
import {logEvent} from 'utils/analytics';

export const resetGame = (connected) => {
  logEvent('GAME_RESET');
  store.dispatch(resetGameAction());
  const state = store.getState();
  if(connected || state.session.roomConnected){
    return database.ref(`rooms/${state.room.id}`).update({
      owner: state.root.userId,
      createdAt: databaseServerTimestamp,
      updatedAt: databaseServerTimestamp,
      gameLocations: gameLocationsSelector(state),
      ...state.config,
      ...state.game,
    });
  }

  return Promise.resolve();
};

export const updateGame = (game) => {
  logEvent('GAME_UPDATE');
  store.dispatch(updateGameAction(game));
  const state = store.getState();
  if(state.session.roomConnected){
    return database.ref(`rooms/${state.room.id}`).update({
      updatedAt: databaseServerTimestamp,
      gameLocations: gameLocationsSelector(state),
      ...state.config,
      ...state.game,
    });
  }

  return Promise.resolve();
};

export const deleteGame = () => {
  logEvent('GAME_DELETE');
  store.dispatch(resetGameAction());
  const state = store.getState();
  if(state.session.roomConnected){
    return database.ref(`rooms/${state.room.id}`).remove();
  }

  return Promise.resolve();
};
