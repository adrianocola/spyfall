import _ from 'lodash';
import shortid from 'shortid';
import React, {useMemo, useState} from 'react';
import {css} from 'emotion';
import {connect} from 'react-redux';
import {Button, Col, Row} from 'reactstrap';
import Localized from 'components/Localized/Localized';
import {useTranslation} from 'react-i18next';
import gameLocationsSelector from 'selectors/gameLocations';
import {DEFAULT_LOCATIONS, GAME_STATES, MAX_PLAYERS, MAX_ROLES, MIN_PLAYERS, SPY_ROLE} from 'consts';
import usePresence from 'hooks/usePresence';
import {updateGame} from 'services/game';
import {store} from 'store';
import {logEvent} from 'utils/analytics';

import ResultPopup from './ResultPopup';

const getSpiesNamesOrIds = (spiesIds, remotePlayers) =>
  _.map(spiesIds, (idOrName) => remotePlayers[idOrName] ? remotePlayers[idOrName].name : idOrName);

const getAllSpiesRoles = (allPlayers, remotePlayers) => {
  const newPlayersRoles = allPlayers.reduce((obj, playerId) => {
    obj[playerId] = SPY_ROLE;
    return obj;
  }, {});

  const newSpies = getSpiesNamesOrIds(_.keys(newPlayersRoles), remotePlayers);

  return {newPlayersRoles, newSpies};
};

const getRegularPlayerRoles = (allPlayers, availableRoles, remotePlayers) => {
  const shuffledRoles = _.shuffle(availableRoles);
  const newPlayersRoles = allPlayers.reduce((obj, playerId, index) => {
    obj[playerId] = shuffledRoles[index];
    return obj;
  }, {});
  const spiesIds = _.keys(_.pickBy(newPlayersRoles, (v) => v === SPY_ROLE));
  const newSpies = getSpiesNamesOrIds(spiesIds, remotePlayers);

  return {newPlayersRoles, newSpies};
};

const getPlayerRoles = (location, allPlayers, availableRoles, remotePlayers = {}) => {
  if(location.allSpies){
    return getAllSpiesRoles(allPlayers, remotePlayers);
  }
  return getRegularPlayerRoles(allPlayers, availableRoles, remotePlayers);
};

export const GameManager = ({started, roomId, roomConnected, remotePlayers, gameLocations, playersCount}) => {
  const [t] = useTranslation();
  const [showResultPopup, setShowResultPopup] = useState(false);
  const totalNumberOfPlayers = useMemo(() => playersCount + _.size(remotePlayers), [playersCount, remotePlayers]);
  const canStartGame = useMemo(() => totalNumberOfPlayers >= MIN_PLAYERS && totalNumberOfPlayers <= MAX_PLAYERS, [totalNumberOfPlayers]);

  const onStartGame = async () => {
    const {
      game: {location, spies},
      config: {players, spyCount, customLocations},
    } = store.getState();

    const newState = GAME_STATES.STARTED;
    const allPlayers = [...players];
    _.forEach(remotePlayers, (remotePlayer, remotePlayerId) => {
      allPlayers.push(remotePlayerId);
    });
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

    let {newPlayersRoles, newSpies} = getPlayerRoles(selectedLocation, allPlayers, availableRoles, remotePlayers);
    // if the same spies, try again (keeping new results)
    if(_.isEqual(_.sortBy(newSpies), _.sortBy(spies))){
      const rolesResult = getPlayerRoles(selectedLocation, allPlayers, availableRoles, remotePlayers);
      newPlayersRoles = rolesResult.newPlayersRoles;
      newSpies = rolesResult.newSpies;
    }

    logEvent('GAME_STARTED', DEFAULT_LOCATIONS[selectedLocationId] ? selectedLocationId : 'CUSTOM_LOCATION');
    updateGame({
      matchId: shortid.generate(),
      state: newState,
      playersRoles: newPlayersRoles,
      location: selectedLocationId,
      prevLocation: location,
      spies: newSpies,
    });
  };

  const onEndGame = async () => {
    setShowResultPopup(true);
    logEvent('GAME_STOPPED');

    updateGame({
      state: GAME_STATES.STOPPED,
      timerRunning: false,
    });
  };

  usePresence(`roomsData/${roomId}`, roomConnected);

  return (
    <React.Fragment>
      <Row className={styles.container}>
        <Col>
          {!started &&
            <Button color={canStartGame ? 'primary' : 'secondary'} block disabled={!canStartGame} outline={!canStartGame} onClick={onStartGame}>
              <Localized name="interface.start_game" />
            </Button>
          }
          {started &&
            <Button color="danger" block onClick={onEndGame}>
              <Localized name="interface.end_game" />
            </Button>
          }
        </Col>
      </Row>
      <ResultPopup remotePlayers={remotePlayers} isOpen={showResultPopup} toggle={() => setShowResultPopup(false)} />
    </React.Fragment>
  );
};

const styles = {
  container: css({
    marginTop: 20,
  }),
};

const mapStateToProps = (state) => ({
  roomId: state.room.id,
  gameLocations: gameLocationsSelector(state),
  roomConnected: state.session.roomConnected,
  playersCount: state.config.players.length,
});

export default connect(mapStateToProps)(GameManager);
