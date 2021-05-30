import { useSelector } from 'react-redux';
import { useDispatcher } from 'hooks/useDispatcher';
import { addPlayerAction, remPlayerAction, updatePlayerAction } from 'actions/config';

export const configPlayersSelector = (state) => state.config.players;

export const useConfigPlayers = () => {
  const players = useSelector(configPlayersSelector);
  const addPlayer = useDispatcher(addPlayerAction);
  const remPlayer = useDispatcher(remPlayerAction);
  const updatePlayer = useDispatcher(updatePlayerAction);
  return { players, addPlayer, remPlayer, updatePlayer };
};
