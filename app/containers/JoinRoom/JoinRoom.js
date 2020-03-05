import React, {useState} from 'react';
import {css} from 'emotion';
import {connect} from 'react-redux';
import {Button, Col, Container, Input, Row} from 'reactstrap';
import Localized from 'components/Localized/Localized';
import ButtonWithLoading from 'components/ButtonWithLoading/ButtonWithLoading';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {database, databaseServerTimestamp} from 'services/firebase';
import {setJoinPlayerAction, setJoinRoomIdAction} from 'actions/joinRoom';
import {setJoinedRoomAction} from 'actions/session';
import {showError} from 'utils/toast';
import {ID_LENGTH} from 'consts';
import {logEvent} from 'utils/analytics';

import RoomClient from './RoomClient';

export const JoinRoom = ({userId, joinRoomId, setJoinRoomId, joinPlayer, setJoinPlayer, joinedRoom, setJoinedRoom}) => {
  const [t] = useTranslation();

  const [loading, setLoading] = useState(false);
  const canJoin = joinRoomId && joinPlayer;

  const onJoinRoom = async () => {
    logEvent('ROOM_PLAYER_ASKED_JOIN');
    setLoading(true);
    const roomOnline = await database.ref(`roomsData/${joinRoomId}/online`).once('value');
    if(roomOnline.exists() && roomOnline.val() === true){
      logEvent('ROOM_PLAYER_JOINED');
      await database.ref(`roomsRemotePlayers/${joinRoomId}/${userId}`).update({
        createdAt: databaseServerTimestamp,
        updatedAt: databaseServerTimestamp,
        name: joinPlayer,
      });
      setJoinedRoom(true);
    }else{
      showError('interface.error_room_connection');
    }
    setLoading(false);
  };

  if(joinedRoom){
    return (
      <RoomClient roomId={joinRoomId} player={joinPlayer} />
    );
  }

  return (
    <Container>
      <Row className={`${styles.container} justify-content-center`}>
        <Col xs={12} md={4}>
          <Input maxLength={ID_LENGTH} type="text" placeholder={t('interface.room')} value={joinRoomId} onChange={(evt) => setJoinRoomId(evt.target.value)} />
        </Col>
        <Col xs={12} md={4}>
          <Input maxLength={20} type="text" placeholder={t('interface.player')} value={joinPlayer} onChange={(evt) => setJoinPlayer(evt.target.value)} />
        </Col>
        <Col xs={12} md={4}>
          <ButtonWithLoading color="success" block onClick={onJoinRoom} loading={loading} disabled={!canJoin}><Localized name="interface.join" /></ButtonWithLoading>
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

const mapStateToProps = (state) => ({
  userId: state.root.userId,
  joinRoomId: state.joinRoom.roomId,
  joinPlayer: state.joinRoom.player,
  joinedRoom: state.session.joinedRoom,
});

const mapDispatchToProps = (dispatch) => ({
  setJoinRoomId: (roomId) => dispatch(setJoinRoomIdAction(roomId)),
  setJoinPlayer: (player) => dispatch(setJoinPlayerAction(player)),
  setJoinedRoom: (joined) => dispatch(setJoinedRoomAction(joined)),
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinRoom);
