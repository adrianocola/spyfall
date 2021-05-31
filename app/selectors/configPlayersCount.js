import { useSelector } from 'react-redux';
import { configPlayersSelector } from './configPlayers';

export const useConfigPlayersCount = () =>
  useSelector(configPlayersSelector)?.length ?? 0;
