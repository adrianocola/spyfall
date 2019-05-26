import React from 'react';
import {css} from 'emotion';
import {Col, Row, Button, Badge } from 'reactstrap';
import {database} from 'services/firebase';

export const RemotePlayer = (props) => {
  const { roomId, playerUserId, remotePlayer } = props;

  const onRemove = () => {
    database.ref(`rooms/${roomId}/remotePlayers/${playerUserId}`).remove();
  };

  return (
    <Row className={styles.player}>
      <Col>
        <Button color="secondary" block disabled>{remotePlayer.name}</Button>
        {remotePlayer.online && <Badge pill color="success" className={styles.isOnline}>✓</Badge>}
        {!remotePlayer.online && <Badge pill color="danger" className={styles.delete} onClick={onRemove}>✘</Badge>}
      </Col>
    </Row>
  );
};

const styles = {
  player: css({
    paddingTop: 5,
    paddingBottom: 5,
  }),
  isOnline: css({
    position: 'absolute',
    right: 25,
    top: 7,
    fontSize: 16,
  }),
  delete: css({
    position: 'absolute',
    right: 25,
    top: 7,
    fontSize: 16,
    cursor: 'pointer',
  }),
};


export default RemotePlayer;
