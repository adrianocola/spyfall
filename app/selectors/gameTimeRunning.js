import { useSelector } from 'react-redux';

export const gameTimeRunningSelector = (state) => state.game.timerRunning;

export const useGameTimeRunning = () =>
  useSelector(gameTimeRunningSelector);
