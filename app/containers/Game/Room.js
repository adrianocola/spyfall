import React from 'react';
import { css } from 'emotion';
import { observer, inject } from 'mobx-react';
import { Row, Col, Button } from 'reactstrap';
import { firestore, firestoreServerTimestamp } from 'services/firebase';
import {SHADES} from 'styles/consts';
import { Link } from 'react-router-dom';
import Localized from 'components/Localized/Localized';

@inject('rootStore', 'configStore', 'gameStore')
@observer
export default class Game extends React.Component{
  onCreateRoom = async () => {
    const {
      rootStore: {roomId, userUID},
      gameStore: { time, spies, setRoom },
      configStore: { gameLocations },
    } = this.props;
    await firestore.collection('rooms').doc(roomId).set({
      owner: userUID,
      createdAt: firestoreServerTimestamp,
      updatedAt: firestoreServerTimestamp,
      time,
      spies,
      locations: gameLocations,
      state: 'new',
    });
    setRoom(roomId);
  };

  render() {
    const { rootStore: { roomId }, gameStore: { room } } = this.props;
    if(room){
      return (
        <Row className={styles.roomControllerContainer}>
          <Col xs={12} sm={5}>
            <Button outline color="secondary" block disabled className={styles.roomId}>
              <Localized name="interface.room" />
              {': '}
              {roomId}
            </Button>
          </Col>
          <Col xs={12} sm={7} className={styles.roomHelp}>
            <Localized name="interface.room_help" />
          </Col>
        </Row>
      );
    }

    return (
      <Row className={styles.roomControllerContainer}>
        <Col>
          <Button color="primary" block onClick={this.onCreateRoom}>
            <Localized name="interface.create_room" />
          </Button>
        </Col>
        <Col>
          <Link to="/join">
            <Button color="primary" block onClick={this.onJoinRoom}>
              <Localized name="interface.join_room" />
            </Button>
          </Link>
        </Col>
      </Row>
    );
  }
}

const styles = {
  roomControllerContainer: css({
    marginTop: 40,
  }),
  roomId: css({
    letterSpacing: 2,
    fontWeight: 700,
    fontFamily: 'Inconsolata, Consolas, monaco, monospace',
    textTransform: 'uppercase',
    wordBreak: 'break-all',
  }),
  roomHelp: css({
    fontSize: '0.7rem',
    color: SHADES.light,
    textAlign: 'center',
  }),
};
