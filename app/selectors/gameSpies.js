import { useSelector } from 'react-redux';
import { store } from 'store';

export const gameSpiesSelector = (state) => state.game.spies;

export const getGameSpies = () => gameSpiesSelector(store.getState());

export const useGameSpies = () =>
  useSelector(gameSpiesSelector);
