import _ from 'lodash';
import React, { useState, useEffect, useMemo } from 'react';
import { css } from 'emotion';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Button, Input } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import LocationsCount from 'components/LocationsCount/LocationsCount';
import Locations from 'components/Locations/Locations';
import { database } from 'services/firebase';
import { addPlayerAction, remPlayerAction, updatePlayerAction, setTimeAction, setSpyCountAction } from 'actions/config';
import gameLocationsSelector from 'selectors/gameLocations';
import selectedLocationsCountSelector from 'selectors/selectedLocationsCount';
import {MAX_PLAYERS, MIN_PLAYERS} from 'consts';

import SpyIcon from 'components/SpyIcon/SpyIcon';
import CogIcon from 'components/CogIcon/CogIcon';

import LocationsPopup from './LocationsPopup';
import GameManager from './GameManager';
import Player from './Player';
import TimerManager from './TimerManager';
import RemotePlayer from './RemotePlayer';
import Room from './Room';

export const Game = (props) => {
  const {
    gameLocations,
    roomId, roomConnected,
    time, setTime,
    spyCount, setSpyCount,
    playersCount, updatePlayer,
    state, prevLocation,
    addPlayer, remPlayer,
    selectedLocationsCount,
  } = props;

  const [room, setRoom] = useState();
  const totalNumberOfPlayers = useMemo(() => playersCount + _.size(room?.remotePlayers), [playersCount, room]);
  const canAddPlayers = useMemo(() => totalNumberOfPlayers < MAX_PLAYERS, [totalNumberOfPlayers]);
  const canRemovePlayers = useMemo(() => totalNumberOfPlayers > MIN_PLAYERS, [totalNumberOfPlayers]);
  const canStartGame = useMemo(() => totalNumberOfPlayers >= MIN_PLAYERS && totalNumberOfPlayers <= MAX_PLAYERS, [totalNumberOfPlayers]);
  const [showLocationsPopup, setShowLocationsPopup] = useState(false);

  useEffect(() => {
    if(roomConnected){
      const roomRef = database.ref(`/rooms/${roomId}`);
      roomRef.on('value', (roomSnapshot) => {
        setRoom(roomSnapshot.val());
      });

      return () => roomRef.off();
    }
  }, [roomConnected]);

  const onPlayerChange = (playerIndex, player) => {
    updatePlayer(playerIndex, player);
  };

  const started = state === 'started';

  return (
    <div className={styles.container}>
      {!started &&
      <Row className={styles.locationsContainer}>
        <Col className="text-center">
          <a href="#" onClick={() => {setShowLocationsPopup(true)}}><Localized name="interface.game_locations" /> (<LocationsCount />)</a>
          <Link to="/settings"><CogIcon className={styles.cogIcon} /></Link>
        </Col>
      </Row>
      }
      {room && _.map(room.remotePlayers, (player, playerUserId) =>
        <RemotePlayer key={playerUserId} roomId={roomId} playerUserId={playerUserId} remotePlayer={player} />
      )}
      {_.times(playersCount).map((index) =>
        <Player key={index} started={started} index={index} onPlayerChange={onPlayerChange} />
      )}
      {!started &&
      <Row className={styles.playersControllerContainer}>
        <Col>
          <Button color={canAddPlayers ? 'primary' : 'secondary'} block onClick={() => addPlayer()} disabled={!canAddPlayers} outline={!canAddPlayers}>
            <Localized name="interface.add_player" />
          </Button>
        </Col>
        <Col>
          <Button color={canRemovePlayers ? 'danger' : 'secondary'} block onClick={() => remPlayer()} disabled={!canRemovePlayers} outline={!canRemovePlayers}>
            <Localized name="interface.rem_player" />
          </Button>
        </Col>
      </Row>
      }
      {started &&
        <Row className={styles.spiesCountContainer}>
          <Col className="text-center">
            {_.times(spyCount).map((i) => <SpyIcon key={i} />)}
          </Col>
        </Row>
      }
      {started &&
        <Row className={styles.locationsContainer}>
          <Col className="text-center">
            <h4><Localized name="interface.game_locations" /> ({selectedLocationsCount})</h4>
          </Col>
        </Row>
      }
      {started &&
        <Locations locations={gameLocations} prevLocation={prevLocation} />
      }
      {started &&
        <TimerManager />
      }
      {!started &&
        <Row className={`${styles.settingsContainer} align-items-center justify-content-center`}>
          <Col>
            <Row className=" align-items-center justify-content-center text-center">
              <Col xs="auto">
                <Input type="radio" name="single" checked={spyCount === 1} onChange={() => setSpyCount(1)} />
                <SpyIcon />
              </Col>
              <Col xs="auto">
                <Input type="radio" name="double" checked={spyCount === 2} onChange={() => setSpyCount(2)} />
                <SpyIcon />
                <SpyIcon />
              </Col>
            </Row>
          </Col>
          <Col>
            <Row className="align-items-center justify-content-center">
              <Col xs="auto" className="text-center">
                <Localized name="interface.timer" />
              </Col>
              <Col xs="auto" className="text-center">
                <Input type="select" name="select" id="timer" value={time} onChange={(evt) => setTime(evt.target.value)}>
                  <option value="360">6:00</option>
                  <option value="420">7:00</option>
                  <option value="480">8:00</option>
                  <option value="540">9:00</option>
                  <option value="600">10:00</option>
                </Input>
              </Col>
            </Row>
          </Col>
        </Row>
      }
      <GameManager room={room} canStartGame={canStartGame} />
      <Room />
      <LocationsPopup isOpen={showLocationsPopup} toggle={() => setShowLocationsPopup(false)} />
    </div>
  );
};

const styles = {
  container: css({
    marginTop: 20,
  }),
  spiesCountContainer: css({
    marginTop: 20,
  }),
  locationsContainer: css({
    marginTop: 20,
  }),
  cogIcon: css({
    marginLeft: 5,
  }),
  playersControllerContainer: css({
    marginTop: 20,
  }),
  settingsContainer: css({
    marginTop: 20,
  }),
  gameControllerContainer: css({
    marginTop: 20,
  }),
};

const mapStateToProps = (state) => ({
  roomId: state.room.id,
  roomConnected: state.session.roomConnected,
  state: state.game.state,
  gameLocations: gameLocationsSelector(state),
  selectedLocationsCount: selectedLocationsCountSelector(state),
  playersCount: state.config.players.length,
  time: state.config.time,
  spyCount: state.config.spyCount,
  prevLocation: state.game.prevLocation,
});

const mapDispatchToProps = (dispatch) => ({
  addPlayer: () => dispatch(addPlayerAction()),
  remPlayer: () => dispatch(remPlayerAction()),
  updatePlayer: (playerIndex, player) => dispatch(updatePlayerAction(playerIndex, player)),
  setTime: (time) => dispatch(setTimeAction(time)),
  setSpyCount: (spyCount) => dispatch(setSpyCountAction(spyCount)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
