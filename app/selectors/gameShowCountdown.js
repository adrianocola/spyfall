import { useSelector } from 'react-redux';

export const gameShowCountdownSelector = (state) => state.game.showCountdown;

export const useGameShowCountdown = () =>
  useSelector(gameShowCountdownSelector);
