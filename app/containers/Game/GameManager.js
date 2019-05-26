import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import { css } from 'emotion';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import { withNamespaces } from 'react-i18next';
import gameLocationsSelector from 'selectors/gameLocations';
import { DEFAULT_LOCATIONS, MAX_ROLES, SPY_ROLE } from 'consts';
import {database, databaseServerTimestamp} from 'services/firebase';
import { updateGame} from 'services/game';

import ResultPopup from './ResultPopup';

const isOfflineForDatabase = {
  online: false,
  lastOnline: databaseServerTimestamp,
};

const isOnlineForDatabase = {
  online: true,
  lastOnline: databaseServerTimestamp,
};

const getPlayerRoles = (allPlayers, availableRoles) => {
  const shuffledRoles = _.shuffle(availableRoles);
  const newPlayersRoles = allPlayers.reduce((obj, playerId, index) => {
    obj[playerId] = shuffledRoles[index];
    return obj;
  }, {});
  const newSpies = _.keys(_.pickBy(newPlayersRoles, (v) => v === SPY_ROLE));

  return {newPlayersRoles, newSpies};
};

export const GameManager = (props) => {
  const {
    t,
    room, roomId, roomConnected,
    gameLocations, customLocations,
    location,
    spyCount,
    state,
    players, spies,
  } = props;

  const [showResultPopup, setShowResultPopup] = useState(false);

  const onStartGame = async () => {
    const newState = 'started';
    const allPlayers = [...players];
    if(room){
      _.forEach(room.remotePlayers, (remotePlayer, remotePlayerId) => {
        allPlayers.push(remotePlayerId);
      });
    }
    const gameLocationsIds = _.keys(gameLocations);
    const selectedLocationId = _.sample(gameLocationsIds.length > 1 ? _.without(gameLocationsIds, location) : gameLocationsIds);
    let selectedLocation;
    let locationRoles;

    if(DEFAULT_LOCATIONS[selectedLocationId]){
      selectedLocation = selectedLocationId;
      locationRoles = _.compact(_.times(MAX_ROLES).map((index) => {
        const rolePath = `location.${selectedLocationId}.role${index + 1}`;
        const role = t(rolePath);
        return role === rolePath ? '' : index;
      }));
    }else{
      selectedLocation = customLocations[selectedLocationId];
      locationRoles = _.compact(_.times(MAX_ROLES).map((index) => selectedLocation[`role${index + 1}`] && index + 1));
    }

    const availableRoles = [
      ..._.times(spyCount).map(() => SPY_ROLE),
      ..._.sampleSize(locationRoles, allPlayers.length - spyCount),
      ..._.times(allPlayers.length - locationRoles.length - spyCount, () => _.sample(locationRoles) || ''),
    ];

    let {newPlayersRoles, newSpies} = getPlayerRoles(allPlayers, availableRoles);
    // if the same spies, try again (keeping new results)
    if(_.isEqual(_.sortBy(newSpies), _.sortBy(spies))){
      const rolesResult = getPlayerRoles(allPlayers, availableRoles);
      newPlayersRoles = rolesResult.newPlayersRoles;
      newSpies = rolesResult.newSpies;
    }

    updateGame({
      state: newState,
      playersRoles: newPlayersRoles,
      location: selectedLocationId,
      prevLocation: location,
      spies: newSpies,
    });
  };

  const onEndGame = async () => {
    const newState = 'stopped';

    setShowResultPopup(true);

    updateGame({
      state: newState,
      timerRunning: false,
    });
  };

  useEffect(() => {
    if(roomConnected){
      const presenceRef = database.ref('.info/connected');
      const userStatusDatabaseRef = database.ref(`rooms/${roomId}`);
      let onDisconnect;
      presenceRef.on('value', (snapshot) => {
        if (!snapshot || snapshot.val() === false) {
          return userStatusDatabaseRef.update(isOfflineForDatabase).catch((err) => console.log('not snapshot error', err)); // eslint-disable-line no-console
        }

        onDisconnect = userStatusDatabaseRef.onDisconnect();
        onDisconnect.update(isOfflineForDatabase).then(() => {
          userStatusDatabaseRef.update(isOnlineForDatabase);
        }).catch((err) => console.log('onDisconnect error', err)); // eslint-disable-line no-console
      });
      return () => {
        if(onDisconnect){
          onDisconnect.cancel();
        }
        presenceRef.off();
        userStatusDatabaseRef.off();
      };
    }
  }, [roomConnected]);

  const started = state === 'started';

  return (
    <div>
      {!started &&
      <Row className={styles.gameManagerContainer}>
        <Col>
          <Button color="success" block onClick={onStartGame}>
            <Localized name="interface.start_game" />
          </Button>
        </Col>
      </Row>
      }
      {started &&
      <Row className={styles.gameManagerContainer}>
        <Col>
          <Button color="danger" block onClick={onEndGame}>
            <Localized name="interface.end_game" />
          </Button>
        </Col>
      </Row>
      }
      <ResultPopup remotePlayers={room && room.remotePlayers} isOpen={showResultPopup} toggle={() => setShowResultPopup(false)} />
    </div>
  );
};

const styles = {
  gameManagerContainer: css({
    marginTop: 20,
  }),
};

const mapStateToProps = (state) => ({
  roomId: state.room.id,
  state: state.game.state,
  gameLocations: gameLocationsSelector(state),
  customLocations: state.config.customLocations,
  prevLocation: state.game.prevLocation,
  location: state.game.location,
  players: state.config.players,
  spyCount: state.config.spyCount,
  spies: state.game.spies,
  roomConnected: state.session.roomConnected,
});

export default withNamespaces()(
  connect(mapStateToProps)(GameManager)
);
