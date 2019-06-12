import React, { useState } from 'react';
import { css } from 'emotion';
import { Row, Col, Button } from 'reactstrap';
import { connect } from 'react-redux';
import {SHADES} from 'styles/consts';
import { Link } from 'react-router-dom';
import { GoClippy } from 'react-icons/go';
import { setRoomConnectedAction } from 'actions/session';
import { refreshRoomId } from 'actions/room';
import ButtonWithLoading from 'components/ButtonWithLoading/ButtonWithLoading';
import Localized from 'components/Localized/Localized';
import { resetGame, deleteGame } from 'services/game';
import copyToClipboard from 'utils/copyToClipboard';
import {showError} from 'utils/toast';
import {logEvent} from 'utils/analytics';

export const Room = ({roomId, roomConnected, setRoomConnected, ...props}) => {
  const [loading, setLoading] = useState(false);

  const onCreateRoom = async () => {
    logEvent('ROOM_CREATE');
    setLoading(true);

    try{
      await resetGame(true);
      setRoomConnected(true);
    }catch(err){
      showError(null, err);
      props.refreshRoomId();
    }

    setLoading(false);
  };

  const onRefreshRoom = async () => {
    logEvent('ROOM_REFRESH');
    await deleteGame();
    props.refreshRoomId();
    await onCreateRoom();
  };

  const onCloseRoom = async () => {
    logEvent('ROOM_CLOSE');
    await deleteGame();
    setRoomConnected(false);
  };

  if(roomConnected){
    return (
      <Row className={styles.roomControllerContainer}>
        <Col xs={12} sm={5}>
          <ButtonWithLoading outline color="secondary" loading={loading} block className={styles.roomId} onClick={() => copyToClipboard(roomId)}>
            <Localized name="interface.room" />
            {': '}
            <span>{roomId}</span>
            {'   '}
            <GoClippy className={styles.copy} />
          </ButtonWithLoading>
        </Col>
        <Col xs={12} sm={7} className={styles.roomHelp}>
          <Localized name="interface.room_instructions" />
          <div className={styles.refresh} onClick={onRefreshRoom}>↻</div>
          <div className={styles.close} onClick={onCloseRoom}>✘</div>
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
  refresh: css({
    display: 'inline-block',
    marginLeft: 10,
    cursor: 'pointer',
    '&:hover': {
      color: SHADES.darker,
    },
  }),
  close: css({
    display: 'inline-block',
    marginLeft: 10,
    cursor: 'pointer',
    '&:hover': {
      color: SHADES.darker,
    },
  }),
};

const mapStateToProps = (state) => ({
  roomId: state.room.id,
  roomConnected: state.session.roomConnected,
  userId: state.root.userId,
});

const mapDispatchToProps = (dispatch) => ({
  setRoomConnected: (connected) => dispatch(setRoomConnectedAction(connected)),
  refreshRoomId: () => dispatch(refreshRoomId()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
