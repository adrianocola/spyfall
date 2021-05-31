export const RESET_GAME = 'GAME_RESET_GAME';
export const UPDATE_GAME = 'GAME_UPDATE_GAME';

export const resetGameAction = () => ({
  type: RESET_GAME,
});

export const updateGameAction = (game) => ({
  type: UPDATE_GAME,
  payload: game,
});
