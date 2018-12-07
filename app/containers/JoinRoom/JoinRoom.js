import React from 'react';
import { observer, inject } from 'mobx-react';
import { css } from 'emotion';
import {Row, Col, Input, Button, Container} from 'reactstrap';
import Localized from 'components/Localized/Localized';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import {observable} from 'mobx';
import { functions } from 'services/firebase';

import RoomClient from './RoomClient';

const updatePlayer = functions.httpsCallable('updatePlayer');

@inject('rootStore')
@observer
export class JoinRoom extends React.Component{
  @observable joinedRoom = false;

  onJoinRoom = () => {
    const { rootStore: { joinRoomId, joinRoomPlayer } } = this.props;
    updatePlayer({
      roomId: joinRoomId,
      playerName: joinRoomPlayer,
      data: {
        status: 'joined',
      },
    }).then((result) => {
      if(result.data === true){
        this.joinedRoom = true;
      }
    });
  };

  render() {
    const { t, rootStore: { joinRoomId, joinRoomPlayer, setJoinRoomId, setJoinRoomPlayer } } = this.props;

    if(this.joinedRoom){
      return (
        <RoomClient roomId={joinRoomId} player={joinRoomPlayer} />
      );
    }

    return (
      <Container>
        <Row className={`${styles.container} justify-content-center`}>
          <Col xs={12} md={4}>
            <Input type="text" placeholder={t('interface.room')} value={joinRoomId} onChange={(evt) => setJoinRoomId(evt.target.value)} />
          </Col>
          <Col xs={12} md={4}>
            <Input type="text" placeholder={t('interface.player')} value={joinRoomPlayer} onChange={(evt) => setJoinRoomPlayer(evt.target.value)} />
          </Col>
          <Col xs={12} md={4}>
            <Button color="success" block onClick={this.onJoinRoom}><Localized name="interface.join" /></Button>
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
  }
}

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

export default withNamespaces()(JoinRoom);
