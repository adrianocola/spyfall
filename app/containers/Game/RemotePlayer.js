import React from 'react';
import { css } from 'emotion';
import { Col, Row, Button, Badge } from 'reactstrap';
import { database } from 'services/firebase';
import { logEvent } from 'utils/analytics';
import { useConfigModeratorMode } from 'selectors/configModeratorMode';

import GameModeratorRoleSelector from './GameModeratorRoleSelector';

export const RemotePlayer = ({ roomId, playerUserId, remotePlayer, started }) => {
  const [moderatorMode] = useConfigModeratorMode();

  const remotePlayerRefPath = `roomsRemotePlayers/${roomId}/${playerUserId}`;
  const onRemove = () => {
    if (started) return;
    logEvent('ROOM_PLAYER_REMOVED');
    database.ref(remotePlayerRefPath).remove();
  };

  const onSetRemovePlayerModeratorRole = (moderatorRole) => {
    database.ref(`${remotePlayerRefPath}/moderatorRole`).set(moderatorRole);
  };

  return (
    <Row className={styles.player}>
      <Col>
        <Button color="secondary" block disabled>{remotePlayer.name}</Button>
        {remotePlayer.online && <Badge pill color="success" className={styles.isOnline}>✓</Badge>}
        {!remotePlayer.online && <Badge pill color="danger" className={styles.isOffline} onClick={onRemove}>✘</Badge>}
      </Col>
      {!started && moderatorMode && (
        <Col>
          <GameModeratorRoleSelector
            moderatorRole={remotePlayer.moderatorRole}
            onModeratorRoleChange={onSetRemovePlayerModeratorRole}
          />
        </Col>
      )}
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
    top: 10,
    fontSize: 16,
  }),
  isOffline: css({
    position: 'absolute',
    right: 25,
    top: 10,
    fontSize: 16,
    cursor: 'pointer',
  }),
};

export default React.memo(RemotePlayer);
