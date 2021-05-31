import { useSelector } from 'react-redux';

export const gameAllSpiesSelector = (state) => state.game.allSpies;

export const useGameAllSpies = () =>
  useSelector(gameAllSpiesSelector);
