import { useSelector } from 'react-redux';

export const gameSpiesSelector = (state) => state.game.spies;

export const useGameSpies = () =>
  useSelector(gameSpiesSelector);
