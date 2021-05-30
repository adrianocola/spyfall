import { useSelector } from 'react-redux';

export const gamePrevLocationSelector = (state) => state.game.prevLocation;

export const useGamePrevLocation = () =>
  useSelector(gamePrevLocationSelector);
