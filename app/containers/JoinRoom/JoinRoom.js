import React, { useEffect, useState } from 'react';
import { css } from 'emotion';
import { Button, Col, Container, Input, Row } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import ButtonWithLoading from 'components/ButtonWithLoading/ButtonWithLoading';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { database, databaseServerTimestamp } from 'services/firebase';
import { showError } from 'utils/toast';
import { ID_LENGTH } from 'consts';
import { logEvent } from 'utils/analytics';
import { useJoinRoomId } from 'selectors/joinRoomId';
import { useJoinPlayer } from 'selectors/joinPlayer';
import { useUserId } from 'selectors/userId';
import { useJoinedRoom } from 'selectors/sessionJoinedRoom';

import RoomClient from './RoomClient';

const ROOM_REGEX = new RegExp(`join/([0-9a-zA-Z]{${ID_LENGTH}})$`);

export const JoinRoom = () => {
  const [t] = useTranslation();

  const [userId] = useUserId();
  const [joinRoomId, setJoinRoomId] = useJoinRoomId();
  const [joinPlayer, setJoinPlayer] = useJoinPlayer();
  const [joinedRoom, setJoinedRoom] = useJoinedRoom();
  const [loading, setLoading] = useState(false);
  const { roomId } = useParams();
  const canJoin = joinRoomId && joinPlayer;

  useEffect(() => {
    if (roomId) setJoinRoomId(roomId);
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onJoinRoom = async () => {
    logEvent('ROOM_PLAYER_ASKED_JOIN');
    setLoading(true);
    const roomOnline = await database.ref(`roomsData/${joinRoomId}/online`).once('value');
    if (roomOnline.exists() && roomOnline.val() === true) {
      logEvent('ROOM_PLAYER_JOINED');
      await database.ref(`roomsRemotePlayers/${joinRoomId}/${userId}`).update({
        createdAt: databaseServerTimestamp,
        updatedAt: databaseServerTimestamp,
        name: joinPlayer,
      });
      setJoinedRoom(true);
    } else {
      showError('interface.error_room_connection');
    }
    setLoading(false);
  };

  const onPasteRoomId = (evt) => {
    if (!evt?.clipboardData?.getData) return;

    evt.preventDefault();
    evt.stopPropagation();
    const pastedText = evt.clipboardData.getData('text/plain');
    if (!pastedText) return setJoinRoomId('');

    const match = pastedText.match(ROOM_REGEX);
    if (match) {
      return setJoinRoomId(match[1]);
    }
    setJoinRoomId(pastedText.substr(0, ID_LENGTH).toUpperCase());
  };

  if (joinedRoom) {
    return (
      <RoomClient roomId={joinRoomId} player={joinPlayer} />
    );
  }

  return (
    <Container>
      <Row className={`${styles.container} justify-content-center`}>
        <Col xs={12} md={4}>
          <Input
            maxLength={ID_LENGTH}
            type="text"
            placeholder={t('interface.room')}
            value={joinRoomId}
            onChange={(evt) => setJoinRoomId(evt.target.value)}
            onPaste={onPasteRoomId}
          />
        </Col>
        <Col xs={12} md={4}>
          <Input
            maxLength={20}
            type="text"
            placeholder={t('interface.player')}
            value={joinPlayer}
            onChange={(evt) => setJoinPlayer(evt.target.value)}
          />
        </Col>
        <Col xs={12} md={4}>
          <ButtonWithLoading
            color="success"
            block
            onClick={onJoinRoom}
            loading={loading}
            disabled={!canJoin}
          >
            <Localized name="interface.join" />
          </ButtonWithLoading>
        </Col>
      </Row>
      <Row className={`${styles.container} justify-content-center`}>
        <Col>
          <Link className={styles.backLink} to="/">
            <Button color="danger" block><Localized name="interface.back_to_game" /></Button>
          </Link>
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
  backLink: css({
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'none',
    },
  }),
};

export default React.memo(JoinRoom);
