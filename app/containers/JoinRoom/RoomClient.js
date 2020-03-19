import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {css} from 'emotion';
import {connect} from 'react-redux';
import {Button, Col, Container, Row} from 'reactstrap';
import Localized from 'components/Localized/Localized';

import Locations from 'components/Locations/Locations';
import RolePopup from 'components/RolePopup/RolePopup';
import ResultsSpies from 'components/ResultsSpies/ResultsSpies';
import {database} from 'services/firebase';
import {setJoinedRoomAction} from 'actions/session';
import SpyIcon from 'components/SpyIcon/SpyIcon';
import Timer from 'components/Timer/Timer';
import Spinner from 'components/Spinner/Spinner';
import {showError} from 'utils/toast';
import usePresence from 'hooks/usePresence';
import {GAME_STATES} from 'consts';
import {logEvent} from 'utils/analytics';

export const RoomClient = ({ userId, roomId, player, joinedRoom, setJoinedRoom }) => {
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
  }, []);

  usePresence(`roomsRemotePlayers/${roomId}/${userId}`, joinedRoom);

  const toggleShowRole = () => {
    if(!showRole) logEvent('PLAYER_VIEW_ROLE');
    setShowRole((prevShowRole) => !prevShowRole);
  };

  const onLeaveRoom = async () => {
    logEvent('ROOM_PLAYER_LEFT');
    if(room){
      await database.ref(`roomsRemotePlayers/${roomId}/${userId}`).remove();
    }
    setJoinedRoom(false);
  };

  if(!room) return <Row><Col className="text-center"><div className={styles.loading}><Spinner /></div></Col></Row>;

  if(!room.online) {
    return (
      <Container className={styles.container}>
        <Row className={styles.stateContainer}>
          <Col>
            <Button color="warning" disabled block onClick={toggleShowRole}><Localized name="interface.error_room_connection" /></Button>
          </Col>
        </Row>
        <Row className={`${styles.linkContainer} justify-content-center`}>
          <Col>
            <Button color="danger" block onClick={onLeaveRoom}><Localized name="interface.leave_room" /></Button>
          </Col>
        </Row>
      </Container>
    );
  }

  const started = room.state === GAME_STATES.STARTED;
  const stopped = room.state === GAME_STATES.STOPPED;
  const locationsSize = Object.keys(gameLocations).length;

  return (
    <Container className={styles.container}>
      <Row className={styles.stateContainer}>
        <Col>
          {started && <Button color="success" block onClick={toggleShowRole}>{player} - <Localized name="interface.show_my_role" /></Button>}
          {stopped && <Button color="danger" outline disabled block>{player} - <Localized name="interface.game_stopped" /></Button>}
          {!started && !stopped && <Button color="primary" outline disabled block>{player} - <Localized name="interface.game_connected" /></Button>}
        </Col>
      </Row>
      {started &&
      <Row className={styles.spiesCountContainer}>
        <Col className="text-center">
          {_.times(room.spyCount).map((i) => <SpyIcon key={i} />)}
        </Col>
      </Row>
      }
      {started && <RolePopup isOpen={showRole} toggle={toggleShowRole} player={player} location={room.location} role={room.playersRoles[userId]} customLocations={gameLocations} />}
      <Row className={styles.stateContainer}>
        <Col className="text-center">
          <h4><Localized name="interface.game_locations" /> ({locationsSize})</h4>
        </Col>
      </Row>
      <Locations matchId={room?.matchId} locations={gameLocations} location={!started && room.location} prevLocation={room.prevLocation} />
      {started &&
        <Row className={styles.timerContainer}>
          <Col>
            <Timer initialValue={room.time} running={room.timerRunning} />
          </Col>
        </Row>
      }
      {!started &&
        <ResultsSpies className={styles.spiesContainer} spies={room.spies} />
      }
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

const mapStateToProps = (state) => ({
  userId: state.root.userId,
  joinedRoom: state.session.joinedRoom,
});

const mapDispatchToProps = (dispatch) => ({
  setJoinedRoom: (joined) => dispatch(setJoinedRoomAction(joined)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomClient);
