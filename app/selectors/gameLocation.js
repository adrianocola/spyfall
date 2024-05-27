import { useSelector } from 'react-redux';
import { store } from '@app/store';

export const gameLocationSelector = (state) => state.game.location;

export const getGameLocation = () => gameLocationSelector(store.getState());

export const useGameLocation = () =>
  useSelector(gameLocationSelector);
