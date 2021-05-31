import { useSelector } from 'react-redux';

export const gamePlayerRolesSelector = (state) => state.game.playersRoles;

export const useGamePlayersRoles = () =>
  useSelector(gamePlayerRolesSelector);
