import React, {useState, useMemo} from 'react';
import { css } from 'emotion';
import { connect } from 'react-redux';
import {Row, Col, Input, Button, Container} from 'reactstrap';
import Localized from 'components/Localized/Localized';
import ButtonWithLoading from 'components/ButtonWithLoading/ButtonWithLoading';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {database, databaseServerTimestamp} from 'services/firebase';
import { setJoinRoomIdAction, setJoinPlayerAction } from 'actions/joinRoom';
import { setJoinedRoomAction } from 'actions/session';

import RoomClient from './RoomClient';

export const JoinRoom = (props) => {
  const {
    userId,
    joinRoomId, setJoinRoomId,
    joinPlayer, setJoinPlayer,
    joinedRoom, setJoinedRoom,
  } = props;

  const [t] = useTranslation();

  const [loading, setLoading] = useState(false);
  const canJoin = useMemo(() => joinRoomId && joinPlayer, [joinRoomId, joinPlayer]);

  const onJoinRoom = async () => {
    setLoading(true);
    await database.ref(`rooms/${joinRoomId}/remotePlayers/${userId}`).update({
      createdAt: databaseServerTimestamp,
      updatedAt: databaseServerTimestamp,
      name: joinPlayer,
      remote: true,
    });

    setJoinedRoom(true);
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
          <Input type="text" placeholder={t('interface.room')} value={joinRoomId} onChange={(evt) => setJoinRoomId(evt.target.value)} />
        </Col>
        <Col xs={12} md={4}>
          <Input type="text" placeholder={t('interface.player')} value={joinPlayer} onChange={(evt) => setJoinPlayer(evt.target.value)} />
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
