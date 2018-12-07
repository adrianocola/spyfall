import React from 'react';
import { css } from 'emotion';
import { observer, inject } from 'mobx-react';
import { observable, computed } from 'mobx';
import { Link } from 'react-router-dom';
import {MAX_PLAYERS, MIN_PLAYERS} from 'consts';
import { Row, Col, Button, Input } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import LocationsPopup from 'containers/LocationsPopup/LocationsPopup';
import {firestore, firestoreServerTimestamp} from 'services/firebase';
import Locations from 'components/Locations/Locations';

import SpyIcon from 'components/SpyIcon/SpyIcon';
import CogIcon from 'components/CogIcon/CogIcon';

import Player from './Player';
import Room from './Room';

@inject('rootStore', 'configStore', 'gameStore')
@observer
export default class Game extends React.Component{
  @observable showLocationsPopup = false;

  @computed get canAddPlayers(){
    const { gameStore: { playersCount } } = this.props;
    return playersCount < MAX_PLAYERS;
  }
  @computed get canRemovePlayers(){
    const { gameStore: { playersCount } } = this.props;
    return playersCount > MIN_PLAYERS;
  }

  onStartGame = async () => {
    const {
      rootStore: { roomId },
      gameStore: { room, players, time, spies, setState, setPlayersRoles },
      configStore: { gameLocations },
    } = this.props;
    const state = 'started';
    const playersRoles = players.reduce((obj, playerName) => {obj[playerName] = 'spy'; return obj}, {});

    setState(state);
    setPlayersRoles(playersRoles);

    if(room){
      await firestore.collection('rooms').doc(roomId).update({
        updatedAt: firestoreServerTimestamp,
        time,
        spies,
        locations: gameLocations,
        state,
        playersRoles,
        startedAt: new Date(),
      });
    }
  };

  onEndGame = async () => {
    const {
      rootStore: { roomId },
      gameStore: {setState },
    } = this.props;

    const state = 'stopped';

    setState(state);

    await firestore.collection('rooms').doc(roomId).update({
      updatedAt: firestoreServerTimestamp,
      state,
      stoppedAt: new Date(),
    });
  };

  onPlayerNameChange = (playerIndex, playerName) => {
    const { gameStore: { updatePlayerName } } = this.props;
    updatePlayerName(playerIndex, playerName);
  };

  render() {
    const {
      gameStore: { room, started, players, playersRoles, spies, time, addPlayer, removePlayer, setTime, setSpies },
      configStore: { selectedLocationsLength, totalLocationsLength, gameLocations },
    } = this.props;

    const playersStatus = room ? room.data.playersStatus || {} : {};

    return (
      <div className={styles.container}>
        {!started &&
          <Row className={styles.locationsContainer}>
            <Col className="text-center">
              <a href="#" onClick={() => {this.showLocationsPopup = true}}><Localized name="interface.game_locations" /> ({selectedLocationsLength}/{totalLocationsLength})</a>
              <Link to="/settings"><CogIcon className={styles.cogIcon} /></Link>
            </Col>
          </Row>
        }
        {players.map((player, index) =>
          <Player key={index} started={started} index={index} player={player} role={playersRoles[player]} remotePlayer={playersStatus[player]} onPlayerNameChange={this.onPlayerNameChange} />
        )}
        {!started &&
          <Row className={styles.playersControllerContainer}>
            <Col>
              <Button color={this.canAddPlayers ? 'primary' : 'secondary'} block onClick={addPlayer} disabled={!this.canAddPlayers} outline={!this.canAddPlayers}>
                <Localized name="interface.add_player" />
              </Button>
            </Col>
            <Col>
              <Button color={this.canRemovePlayers ? 'danger' : 'secondary'} block onClick={() => removePlayer()} disabled={!this.canRemovePlayers} outline={!this.canRemovePlayers}>
                <Localized name="interface.rem_player" />
              </Button>
            </Col>
          </Row>
        }
        {started &&
          <Row className={styles.locationsContainer}>
            <Col className="text-center">
              <h4><Localized name="interface.game_locations" /> ({selectedLocationsLength})</h4>
            </Col>
          </Row>
        }
        {started &&
          <Locations locations={gameLocations} />
        }
        <Row className={`${styles.settingsContainer} align-items-center justify-content-center`}>
          <Col>
            <Row className=" align-items-center justify-content-center text-center">
              <Col xs="auto">
                <Input type="radio" name="single" checked={spies === 1} onChange={() => setSpies(1)} />
                <SpyIcon />
              </Col>
              <Col xs="auto">
                <Input type="radio" name="double" checked={spies === 2} onChange={() => setSpies(2)} />
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
        {!started &&
          <Row className={styles.gameControllerContainer}>
            <Col>
              <Button color="success" block onClick={this.onStartGame}>
                <Localized name="interface.start_game" />
              </Button>
            </Col>
          </Row>
        }
        {started &&
          <Row className={styles.gameControllerContainer}>
            <Col>
              <Button color="danger" block onClick={this.onEndGame}>
                <Localized name="interface.end_game" />
              </Button>
            </Col>
          </Row>
        }
        <Room />
        <LocationsPopup isOpen={this.showLocationsPopup} toggle={() => {this.showLocationsPopup = false}} />
      </div>
    );
  }
}

const styles = {
  container: css({
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
