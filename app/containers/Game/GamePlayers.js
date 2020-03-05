import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {updatePlayerAction} from 'actions/config';
import Player from './Player';
import RemotePlayer from './RemotePlayer';

export const GamePlayers = ({started, remotePlayers, roomId, playersCount, updatePlayer}) => (
  <React.Fragment>
    {_.map(remotePlayers, (player, playerUserId) =>
      <RemotePlayer key={playerUserId} roomId={roomId} playerUserId={playerUserId} remotePlayer={player} started={started} />
    )}
    {_.times(playersCount).map((index) =>
      <Player key={index} started={started} index={index} onPlayerChange={updatePlayer} />
    )}
  </React.Fragment>
);

const mapStateToProps = (state) => ({
  roomId: state.room.id,
  playersCount: state.config.players.length,
});

const mapDispatchToProps = (dispatch) => ({
  updatePlayer: (playerIndex, player) => dispatch(updatePlayerAction(playerIndex, player)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GamePlayers);
