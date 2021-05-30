import { useSelector } from 'react-redux';

export const gameLocationSelector = (state) => state.game.location;

export const useGameLocation = () =>
  useSelector(gameLocationSelector);
