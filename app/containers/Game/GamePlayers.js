import _ from 'lodash';
import React from 'react';
import { useRoomId } from 'selectors/roomId';
import { useConfigPlayersCount } from 'selectors/configPlayersCount';
import { useConfigPlayers } from 'selectors/configPlayers';

import Player from './Player';
import RemotePlayer from './RemotePlayer';

export const GamePlayers = ({ started, remotePlayers }) => {
  const [roomId] = useRoomId();
  const playersCount = useConfigPlayersCount();
  const { updatePlayer } = useConfigPlayers();
  return (
    <>
      {_.map(remotePlayers, (player, playerUserId) => (
        <RemotePlayer
          key={playerUserId}
          roomId={roomId}
          playerUserId={playerUserId}
          remotePlayer={player}
          started={started}
        />
      ))}
      {_.times(playersCount).map((index) => (
        <Player
          key={index}
          started={started}
          index={index}
          onPlayerChange={updatePlayer}
        />
      ))}
    </>
  );
};

export default React.memo(GamePlayers);
