import _ from 'lodash';
import { store } from 'store';
import { resetGameAction, updateGameAction } from 'actions/game';
import { database, databaseServerTimestamp } from 'services/firebase';
import { gameLocationsSelector } from 'selectors/gameLocations';
import { logEvent } from 'utils/analytics';

let lastRoom = {};
let lastLocations = {};

const saveGame = (meta = {}) => {
  const promises = [];
  const state = store.getState();

  const newRoom = {
    ...state.config,
    ...state.game,
    ...meta,
    updatedAt: databaseServerTimestamp,
  };

  const newLocations = gameLocationsSelector(state);

  if (!_.isEqual(lastRoom, newRoom)) {
    promises.push(database.ref(`roomsData/${state.room.id}`).update(newRoom));
    lastRoom = newRoom;
  }

  if (!_.isEqual(lastLocations, newLocations)) {
    promises.push(database.ref(`roomsLocations/${state.room.id}`).set(newLocations));
    lastLocations = newLocations;
  }

  return Promise.all(promises);
};

export const resetGame = (connected) => {
  logEvent('GAME_RESET');
  store.dispatch(resetGameAction());
  const state = store.getState();
  if (connected || state.session.roomConnected) {
    return saveGame({
      owner: state.root.userId,
      createdAt: databaseServerTimestamp,
    });
  }

  return true;
};

export const updateGame = (game) => {
  logEvent('GAME_UPDATE');
  store.dispatch(updateGameAction(game));
  const state = store.getState();
  if (state.session.roomConnected) {
    return saveGame();
  }

  return true;
};

export const deleteGame = async () => {
  logEvent('GAME_DELETE');
  store.dispatch(resetGameAction());
  const state = store.getState();
  if (state.session.roomConnected) {
    await Promise.all([
      database.ref(`roomsLocations/${state.room.id}`).remove(),
      database.ref(`roomsRemotePlayers/${state.room.id}`).remove(),
    ]);
    // must be last because of permissions
    await database.ref(`roomsData/${state.room.id}`).remove();
  }

  lastRoom = {};
  lastLocations = {};

  return true;
};
