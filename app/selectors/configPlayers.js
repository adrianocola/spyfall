import { useSelector } from 'react-redux';
import { useDispatcher } from 'hooks/useDispatcher';
import { addPlayerAction, remPlayerAction, updatePlayerAction } from 'actions/config';
import { store } from 'store';

export const configPlayersSelector = (state) => state.config.players;

export const getConfigPlayers = () => configPlayersSelector(store.getState());

export const useConfigPlayers = () => {
  const players = useSelector(configPlayersSelector);
  const addPlayer = useDispatcher(addPlayerAction);
  const remPlayer = useDispatcher(remPlayerAction);
  const updatePlayer = useDispatcher(updatePlayerAction);
  return { players, addPlayer, remPlayer, updatePlayer };
};
