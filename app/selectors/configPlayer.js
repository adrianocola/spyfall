import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { updatePlayerAction } from 'actions/config';
import { useConfigPlayers } from './configPlayers';

export const useConfigPlayer = (playerIndex) => {
  const { players } = useConfigPlayers();
  const player = players[playerIndex];
  const dispatch = useDispatch();
  const setPlayer = useCallback((newPlayer) => {
    dispatch(updatePlayerAction(playerIndex, newPlayer));
  }, [dispatch, playerIndex]);
  return [player, setPlayer];
};
