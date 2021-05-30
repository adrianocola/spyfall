import { useSelector } from 'react-redux';

export const gameMatchIdSelector = (state) => state.game.matchId;

export const useGameMatchId = () =>
  useSelector(gameMatchIdSelector);
