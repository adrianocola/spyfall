import React, { useEffect, useState } from 'react';
import { css } from 'emotion';
import { Button, Col, Container, Row } from 'reactstrap';
import Localized from 'components/Localized/Localized';

import Locations from 'components/Locations/Locations';
import RolePopup from 'components/RolePopup/RolePopup';
import ResultsSpies from 'components/ResultsSpies/ResultsSpies';
import { database } from 'services/firebase';
import Timer from 'components/Timer/Timer';
import Spinner from 'components/Spinner/Spinner';
import ModeratorMode from 'components/ModeratorMode/ModeratorMode';
import { showError } from 'utils/toast';
import usePresence from 'hooks/usePresence';
import { GAME_STATES } from 'consts';
import { logEvent } from 'utils/analytics';
import { useUserId } from 'selectors/userId';
import { useJoinedRoom } from 'selectors/sessionJoinedRoom';

import SpyCount from 'components/SpyCount/SpyCount';

export const RoomClient = ({ roomId, player }) => {
  const [userId] = useUserId();
  const [joinedRoom, setJoinedRoom] = useJoinedRoom();
  const [room, setRoom] = useState(null);
  const [gameLocations, setGameLocations] = useState({});
  const [showRole, setShowRole] = useState(false);

  useEffect(() => {
    logEvent('ROOM_CONNECTED_PLAYER');
    const roomRef = database.ref(`/roomsData/${roomId}`);
    const roomLocationsRef = database.ref(`/roomsLocations/${roomId}`);
    roomRef.on('value', (roomSnapshot) => {
      if (!roomSnapshot || !roomSnapshot.exists() || !roomSnapshot.val()) {
        showError('interface.error_room_connection');
        return setJoinedRoom(false);
      }
      setRoom(roomSnapshot.val());
    });
    roomLocationsRef.on('value', (roomLocationsSnapshot) => {
      if (!roomLocationsSnapshot || !roomLocationsSnapshot.exists() || !roomLocationsSnapshot.val()) {
        showError('interface.error_room_connection');
        return setJoinedRoom(false);
      }
      setGameLocations(roomLocationsSnapshot.val() || {});
    });

    return () => {
      roomRef.off();
      roomLocationsRef.off();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  usePresence(`roomsRemotePlayers/${roomId}/${userId}`, joinedRoom);

  const toggleShowRole = () => {
    if (!showRole) logEvent('PLAYER_VIEW_ROLE');
    setShowRole((prevShowRole) => !prevShowRole);
  };

  const onLeaveRoom = async () => {
    logEvent('ROOM_PLAYER_LEFT');
    if (room) {
      await database.ref(`roomsRemotePlayers/${roomId}/${userId}`).remove();
    }
    setJoinedRoom(false);
  };

  if (!room) return <Row><Col className="text-center"><div className={styles.loading}><Spinner /></div></Col></Row>;

  const started = room.state === GAME_STATES.STARTED;
  const stopped = room.state === GAME_STATES.STOPPED;
  const locationsSize = Object.keys(gameLocations).length;

  return (
    <Container className={styles.container}>
      {!room.online && (
        <Row className={styles.stateContainer}>
          <Col>
            <Button color="warning" disabled block><Localized name="interface.error_room_connection" /></Button>
          </Col>
        </Row>
      )}
      {started && room.moderatorMode && <ModeratorMode />}
      <Row className={styles.stateContainer}>
        <Col>
          {started && <Button color="success" block onClick={toggleShowRole}>{player} - <Localized name="interface.show_my_role" /></Button>}
          {stopped && <Button color="danger" outline disabled block>{player} - <Localized name="interface.game_stopped" /></Button>}
          {!started && !stopped && <Button color="primary" outline disabled block>{player} - <Localized name="interface.game_connected" /></Button>}
        </Col>
      </Row>
      {started && (
        <>
          <SpyCount spyCount={room.spyCount} spies={room.spies} allSpies={room.allSpies} hideSpyCount={room.hideSpyCount} />
          <RolePopup isOpen={showRole} toggle={toggleShowRole} player={player} location={room.location} role={room.playersRoles[userId]} customLocations={gameLocations} />
        </>
      )}
      <Row className={styles.stateContainer}>
        <Col className="text-center">
          <h4><Localized name="interface.game_locations" /> ({locationsSize})</h4>
        </Col>
      </Row>
      <Locations matchId={room?.matchId} locations={gameLocations} location={!started && room.location} prevLocation={room.prevLocation} />
      {started && (
        <Row className={styles.timerContainer}>
          <Col>
            <Timer initialValue={room.time} running={room.timerRunning} showCountdown={room.showCountdown} />
          </Col>
        </Row>
      )}
      {!started && (
        <ResultsSpies className={styles.spiesContainer} spies={room.spies} />
      )}
      <Row className={`${styles.linkContainer} justify-content-center`}>
        <Col>
          <Button color="danger" block onClick={onLeaveRoom}><Localized name="interface.leave_room" /></Button>
        </Col>
      </Row>
    </Container>
  );
};

const styles = {
  loading: css({
    marginTop: 30,
    marginBottom: 30,
    display: 'inline-block',
  }),
  container: css({
    marginTop: 50,
    marginBottom: 50,
    display: 'inline-block',
  }),
  stateContainer: css({
    marginBottom: 20,
  }),
  timerContainer: css({
    marginTop: 30,
  }),
  spiesContainer: css({
    marginTop: 20,
    fontWeight: 'bold',
  }),
  linkContainer: css({
    marginTop: 50,
  }),
};

export default React.memo(RoomClient);
