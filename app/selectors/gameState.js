import { useSelector } from 'react-redux';
import { useDispatcher } from 'hooks/useDispatcher';
import { resetGameAction, updateGameAction } from 'actions/game';

export const gameStateSelector = (state) => state.game.state;

export const useGameState = () => {
  const gameState = useSelector(gameStateSelector);
  const resetGameState = useDispatcher(resetGameAction);
  const updateGameState = useDispatcher(updateGameAction);
  return [gameState, updateGameState, resetGameState];
};
