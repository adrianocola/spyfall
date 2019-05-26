import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import { css } from 'emotion';
import { connect } from 'react-redux';
import {Row, Col, Button, Container} from 'reactstrap';
import Localized from 'components/Localized/Localized';

import Locations from 'components/Locations/Locations';
import RolePopup from 'components/RolePopup/RolePopup';
import ResultsSpies from 'components/ResultsSpies/ResultsSpies';
import {database, databaseServerTimestamp} from 'services/firebase';
import {setJoinedRoomAction} from 'actions/session';
import SpyIcon from 'components/SpyIcon/SpyIcon';
import Timer from 'components/Timer/Timer';

const isOfflineForDatabase = {
  online: false,
  lastOnline: databaseServerTimestamp,
};

const isOnlineForDatabase = {
  online: true,
  lastOnline: databaseServerTimestamp,
};

export const RoomClient = (props) => {
  const { userId, roomId, player, joinedRoom, setJoinedRoom } = props;

  const [room, setRoom] = useState();
  const [showRole, setShowRole] = useState(false);

  useEffect(() => {
    const roomRef = database.ref(`/rooms/${roomId}`);
    roomRef.on('value', (roomSnapshot) => {
      setRoom(roomSnapshot.val());
    });

    return () => roomRef.off();
  }, []);

  useEffect(() => {
    if(joinedRoom){
      const presenceRef = database.ref('.info/connected');
      const userStatusDatabaseRef = database.ref(`rooms/${roomId}/remotePlayers/${userId}`);
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
  }, [joinedRoom]);

  const toggleShowRole = () => {
    setShowRole((prevShowRole) => !prevShowRole);
  };

  const onLeaveRoom = async () => {
    await database.ref(`rooms/${roomId}/remotePlayers/${userId}`).remove();
    setJoinedRoom(false);
  };

  if(!room) return <div>LOADING...</div>;

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

  const started = room.state === 'started';
  const stopped = room.state === 'stopped';
  const locationsSize = Object.keys(room.gameLocations).length;

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
      {started && <RolePopup isOpen={showRole} toggle={toggleShowRole} player={player} location={room.location} role={room.playersRoles[userId]} customLocations={room.gameLocations} />}
      <Row className={styles.stateContainer}>
        <Col className="text-center">
          <h4><Localized name="interface.game_locations" /> ({locationsSize})</h4>
        </Col>
      </Row>
      <Locations locations={room.gameLocations} location={!started && room.location} prevLocation={room.prevLocation} />
      {started &&
        <Row className={styles.timerContainer}>
          <Col>
            <Timer initialValue={room.time} running={room.timerRunning} />
          </Col>
        </Row>
      }
      {!started &&
        <ResultsSpies className={styles.spiesContainer} spies={room.spies} remotePlayers={room.remotePlayers} />
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
  container: css({
    marginTop: 50,
    marginBottom: 50,
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
