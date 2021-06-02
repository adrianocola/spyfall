import React, { useState } from 'react';
import { css } from 'emotion';
import { Button, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { GoClippy } from 'react-icons/go';
import ButtonWithLoading from 'components/ButtonWithLoading/ButtonWithLoading';
import Localized from 'components/Localized/Localized';
import { deleteGame, resetGame } from 'services/game';
import copyToClipboard from 'utils/copyToClipboard';
import { showError, showSuccess } from 'utils/toast';
import { logEvent } from 'utils/analytics';
import { useTranslation } from 'react-i18next';
import { useRoomConnected } from 'selectors/sessionRoomConnected';
import { useRoomId } from 'selectors/roomId';

export const Room = ({ started }) => {
  const [loading, setLoading] = useState(false);
  const [roomId, refreshRoomId] = useRoomId();
  const [roomConnected, setRoomConnected] = useRoomConnected();
  const [t] = useTranslation();

  const onCreateRoom = async () => {
    logEvent('ROOM_CREATE');
    setLoading(true);

    try {
      await resetGame(true);
      setRoomConnected(true);
    } catch (err) {
      showError(null, err);
      refreshRoomId();
    }

    setLoading(false);
  };

  const onRefreshRoom = async () => {
    logEvent('ROOM_REFRESH');
    await deleteGame();
    refreshRoomId();
    await onCreateRoom();
  };

  const onCloseRoom = async () => {
    logEvent('ROOM_CLOSE');
    await deleteGame();
    setRoomConnected(false);
  };

  const onRoomCopy = () => {
    copyToClipboard(`${window.location.origin}/join/${roomId}`);
    showSuccess(t('interface.link_copied'));
  };

  if (roomConnected) {
    return (
      <Row className={styles.roomControllerContainer}>
        <Col xs={12} sm={5}>
          <ButtonWithLoading outline color="secondary" loading={loading} block className={styles.roomId} onClick={onRoomCopy}>
            <Localized name="interface.room" />
            {': '}
            <span>{roomId}</span>
            {'   '}
            <GoClippy className={styles.copy} />
          </ButtonWithLoading>
        </Col>
        <Col xs={12} sm={7} className={`${styles.roomHelp} text-secondary`}>
          <Localized name="interface.room_instructions" />
          <div className={`${styles.refresh} text-dark`} onClick={onRefreshRoom}>↻</div>
          <div className={`${styles.close} text-dark`} onClick={onCloseRoom}>✘</div>
        </Col>
      </Row>
    );
  }

  if (started) return null;

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
  }),
  close: css({
    display: 'inline-block',
    marginLeft: 10,
    cursor: 'pointer',
  }),
};

export default React.memo(Room);
