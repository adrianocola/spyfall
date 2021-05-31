import { useSelector } from 'react-redux';
import { store } from 'store';

export const gameLocationSelector = (state) => state.game.location;

export const getGameLocation = () => gameLocationSelector(store.getState());

export const useGameLocation = () =>
  useSelector(gameLocationSelector);
