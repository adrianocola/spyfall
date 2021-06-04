import _ from 'lodash';
import shortid from 'shortid';
import React, { useMemo, useState } from 'react';
import { css } from 'emotion';
import { Button, Col, Row } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import { useTranslation } from 'react-i18next';
import { useGameLocations } from 'selectors/gameLocations';
import { DEFAULT_LOCATIONS, GAME_STATES, MAX_PLAYERS, MAX_ROLES, MIN_PLAYERS, RANDOM, SPY_ROLE } from 'consts';
import usePresence from 'hooks/usePresence';
import { updateGame } from 'services/game';
import { logDataEvent, logEvent } from 'utils/analytics';
import { useRoomId } from 'selectors/roomId';
import { useRoomConnected } from 'selectors/sessionRoomConnected';
import { useConfigPlayersCount } from 'selectors/configPlayersCount';
import { getConfigAutoStartTimer } from 'selectors/configAutoStartTimer';
import { getConfigPlayers } from 'selectors/configPlayers';
import { getConfigSpyCount } from 'selectors/configSpyCount';
import { getCustomLocations } from 'selectors/customLocations';
import { getGameLocation } from 'selectors/gameLocation';
import { getGameSpies } from 'selectors/gameSpies';
import { getConfigModeratorMode } from 'selectors/configModeratorMode';
import { getConfigModeratorLocation } from 'selectors/configModeratorLocation';
import { getConfigHideSpyCount } from 'selectors/configHideSpyCount';

import { getConfigTime } from 'selectors/configTime';
import ResultPopup from './ResultPopup';

const getSpiesNamesOrIds = (spiesIds, remotePlayers) =>
  _.map(spiesIds, (idOrName) => (remotePlayers?.[idOrName] ? remotePlayers[idOrName].name : idOrName));

const getAllSpiesRoles = (allPlayers, remotePlayers) => {
  const newPlayersRoles = allPlayers.reduce((obj, playerId) => {
    obj[playerId] = SPY_ROLE;
    return obj;
  }, {});

  const newSpies = getSpiesNamesOrIds(_.keys(newPlayersRoles), remotePlayers);

  return { newPlayersRoles, newSpies };
};

const getRegularPlayerRoles = (allPlayers, availableRoles, remotePlayers) => {
  const shuffledRoles = _.shuffle(availableRoles);
  const newPlayersRoles = allPlayers.reduce((obj, playerId, index) => {
    obj[playerId] = shuffledRoles[index];
    return obj;
  }, {});
  const spiesIds = _.keys(_.pickBy(newPlayersRoles, (v) => v === SPY_ROLE));
  const newSpies = getSpiesNamesOrIds(spiesIds, remotePlayers);

  return { newPlayersRoles, newSpies };
};

const getPlayerRoles = (location, allPlayers, availableRoles, remotePlayers = {}) => {
  if (location.allSpies) {
    return getAllSpiesRoles(allPlayers, remotePlayers);
  }
  return getRegularPlayerRoles(allPlayers, availableRoles, remotePlayers);
};

export const GameManager = ({ started, remotePlayers }) => {
  const [t] = useTranslation();
  const [roomId] = useRoomId();
  const [roomConnected] = useRoomConnected();
  const playersCount = useConfigPlayersCount();
  const gameLocations = useGameLocations();
  const [showResultPopup, setShowResultPopup] = useState(false);
  const totalNumberOfPlayers = useMemo(() => playersCount + _.size(remotePlayers), [playersCount, remotePlayers]);
  const canStartGame = useMemo(() => totalNumberOfPlayers >= MIN_PLAYERS && totalNumberOfPlayers <= MAX_PLAYERS, [totalNumberOfPlayers]);

  const onStartGame = async () => {
    const prevLocation = getGameLocation();
    const prevSpies = getGameSpies();
    const players = getConfigPlayers();
    const spyCount = getConfigSpyCount();
    const time = getConfigTime();
    const customLocations = getCustomLocations();
    const moderatorMode = getConfigModeratorMode();
    const moderatorLocation = getConfigModeratorLocation();
    const hideSpyCount = getConfigHideSpyCount();
    const autoStartTimer = getConfigAutoStartTimer();

    const newState = GAME_STATES.STARTED;
    const allPlayers = _.map(players, 'name');
    _.forEach(remotePlayers, (remotePlayer, remotePlayerId) => {
      allPlayers.push(remotePlayerId);
    });
    let selectedLocationId;
    if (moderatorMode && moderatorLocation && moderatorLocation !== RANDOM && (DEFAULT_LOCATIONS[moderatorLocation] || customLocations[moderatorLocation])) {
      selectedLocationId = moderatorLocation;
    } else {
      const gameLocationsIds = _.keys(gameLocations);
      selectedLocationId = _.sample(gameLocationsIds.length > 1 ? _.without(gameLocationsIds, prevLocation) : gameLocationsIds);
    }

    let selectedLocation;
    let locationRoles;

    if (DEFAULT_LOCATIONS[selectedLocationId]) {
      selectedLocation = selectedLocationId;
      locationRoles = _.compact(_.times(MAX_ROLES).map((index) => {
        const rolePath = `location.${selectedLocationId}.role${index + 1}`;
        const role = t(rolePath);
        return role === rolePath ? '' : index;
      }));
    } else {
      selectedLocation = customLocations[selectedLocationId];
      locationRoles = _.compact(_.times(MAX_ROLES).map((index) => selectedLocation[`role${index + 1}`] && index + 1));
    }

    const allSpies = selectedLocation.allSpies ?? false;

    const availableLocationRoles = [...locationRoles];
    const availablePlayers = [...allPlayers];
    const reservedPlayersRoles = {};
    const reservedSpies = [];
    if (moderatorMode && !allSpies) {
      const checkPlayer = (playerId, playerName, moderatorRole) => {
        if (!moderatorRole || moderatorRole === RANDOM) return;

        // reserve spy role
        if (moderatorRole === SPY_ROLE) {
          _.pull(availablePlayers, playerId);
          reservedPlayersRoles[playerId] = SPY_ROLE;
          reservedSpies.push(playerName);
          return;
        }

        // if random location, don't reserve roles
        if (moderatorLocation === RANDOM) return;

        const defaultRoleKey = `location.${moderatorLocation}.role${moderatorRole}`;
        const roleValue = selectedLocation[`role${moderatorRole}`] ?? t(defaultRoleKey);
        // if a valid location role, reserve this role
        if (roleValue && roleValue !== defaultRoleKey) {
          const intModeratorRole = parseInt(moderatorRole, 10);
          _.pull(availableLocationRoles, intModeratorRole);
          _.pull(availablePlayers, playerId);
          reservedPlayersRoles[playerId] = intModeratorRole;
        }
      };

      _.forEach(players, (player) => {
        checkPlayer(player.name, player.name, player.moderatorRole);
      });
      _.forEach(remotePlayers, (player, playerId) => {
        checkPlayer(playerId, player.name, player.moderatorRole);
      });
    }

    const spyRoles = _.times(spyCount - reservedSpies.length).map(() => SPY_ROLE);
    const uniqueRoles = _.sampleSize(availableLocationRoles, availablePlayers.length - spyRoles.length);
    const repeatedRoles = _.times(availablePlayers.length - availableLocationRoles.length - spyRoles.length, () => _.sample(locationRoles) || '');

    const availableRoles = [
      ...spyRoles,
      ...uniqueRoles,
      ...repeatedRoles,
    ];

    let { newPlayersRoles, newSpies } = getPlayerRoles(selectedLocation, availablePlayers, availableRoles, remotePlayers);
    // if the same spies, try again (keep new results)
    if (!allSpies && _.isEqual(_.sortBy(newSpies), _.sortBy(prevSpies))) {
      ({ newPlayersRoles, newSpies } = getPlayerRoles(selectedLocation, availablePlayers, availableRoles, remotePlayers));
    }

    const playersRoles = { ...reservedPlayersRoles, ...newPlayersRoles };
    const spies = [...reservedSpies, ...newSpies];

    logDataEvent('GAME_STARTED', {
      event: DEFAULT_LOCATIONS[selectedLocationId] ? selectedLocationId : 'CUSTOM_LOCATION',
      selectedLocationsCount: _.size(gameLocations),
      customLocationsCount: _.size(customLocations),
      localPlayersCount: _.size(players),
      remotePlayersCount: _.size(remotePlayers),
      playersCount: _.size(players) + _.size(remotePlayers),
      realSpyCount: spies.length,
      spyCount,
      moderatorMode,
      hideSpyCount,
      autoStartTimer,
      time,
      roomConnected,
    });
    updateGame({
      matchId: shortid.generate(),
      state: newState,
      playersRoles,
      location: selectedLocationId,
      prevLocation,
      spies,
      time,
      showCountdown: autoStartTimer,
      hideSpyCount,
      allSpies,
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
    <>
      <Row className={styles.container}>
        <Col>
          {!started && (
            <Button color={canStartGame ? 'primary' : 'secondary'} block disabled={!canStartGame} outline={!canStartGame} onClick={onStartGame}>
              <Localized name="interface.start_game" />
            </Button>
          )}
          {started && (
            <Button color="danger" block onClick={onEndGame}>
              <Localized name="interface.end_game" />
            </Button>
          )}
        </Col>
      </Row>
      <ResultPopup remotePlayers={remotePlayers} isOpen={showResultPopup} toggle={() => setShowResultPopup(false)} />
    </>
  );
};

const styles = {
  container: css({
    marginTop: 20,
  }),
};

export default React.memo(GameManager);
