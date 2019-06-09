import React, { useState } from 'react';
import { css } from 'emotion';
import { Row, Col, Button } from 'reactstrap';
import { connect } from 'react-redux';
import {SHADES} from 'styles/consts';
import { Link } from 'react-router-dom';
import { GoClippy } from 'react-icons/go';
import { setRoomConnectedAction } from 'actions/session';
import ButtonWithLoading from 'components/ButtonWithLoading/ButtonWithLoading';
import Localized from 'components/Localized/Localized';
import { resetGame } from 'services/game';
import copyToClipboard from 'utils/copyToClipboard';

export const Room = (props) => {
  const { roomId, roomConnected, setRoomConnected } = props;

  const [loading, setLoading] = useState(false);

  const onCreateRoom = async () => {
    setLoading(true);
    setRoomConnected(true);

    await resetGame(null);

    setLoading(false);
  };

  if(roomConnected){
    return (
      <Row className={styles.roomControllerContainer}>
        <Col xs={12} sm={5}>
          <Button outline color="secondary" block className={styles.roomId} onClick={() => copyToClipboard(roomId)}>
            <Localized name="interface.room" />
            {': '}
            <span>{roomId}</span>
            {'   '}
            <GoClippy className={styles.copy} />
          </Button>
        </Col>
        <Col xs={12} sm={7} className={styles.roomHelp}>
          <Localized name="interface.room_instructions" />
        </Col>
      </Row>
    );
  }

  return (
    <Row className={styles.roomControllerContainer}>
      <Col>
        <ButtonWithLoading color="primary" block loading={loading} onClick={onCreateRoom}>
          <Localized name="interface.create_room" />
        </ButtonWithLoading>
      </Col>
      <Col>
        <Link to="/join">
          <Button color="primary" block>
            <Localized name="interface.join_room" />
          </Button>
        </Link>
      </Col>
    </Row>
  );
};

const styles = {
  roomControllerContainer: css({
    marginTop: 40,
    alignItems: 'center',
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
  copy: css({
    fontSize: '1rem',
    marginBottom: 5,
  }),
};

const mapStateToProps = (state) => ({
  roomId: state.room.id,
  roomConnected: state.session.roomConnected,
  userId: state.root.userId,
});

const mapDispatchToProps = (dispatch) => ({
  setRoomConnected: (connected) => dispatch(setRoomConnectedAction(connected)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
