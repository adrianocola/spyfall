import { useGamePlayersRoles } from './gamePlayerRoles';

export const useGamePlayerRole = (player) => {
  const playersRoles = useGamePlayersRoles();
  const playerRole = playersRoles?.[player];
  return playerRole;
};
