import React, { useEffect, useState } from 'react';
import { css } from 'emotion';
import { Button, Col, Input, Row } from 'reactstrap';
import { logEvent } from 'utils/analytics';
import { useConfigPlayer } from 'selectors/configPlayer';
import { useGamePlayerRole } from 'selectors/gamePlayerRole';
import { useGameLocation } from 'selectors/gameLocation';
import { useCustomLocations } from 'selectors/customLocations';
import { useConfigPlayersCount } from 'selectors/configPlayersCount';
import { useConfigModeratorMode } from 'selectors/configModeratorMode';

import RolePopup from 'components/RolePopup/RolePopup';
import GameModeratorRoleSelector from './GameModeratorRoleSelector';

export const Player = ({ index, started, onPlayerChange }) => {
  const [player] = useConfigPlayer(index);
  const role = useGamePlayerRole(player.name);
  const location = useGameLocation();
  const [moderatorMode] = useConfigModeratorMode();
  const { customLocations } = useCustomLocations();
  const localPlayerAmount = useConfigPlayersCount();
  const [showRole, setShowRole] = useState(false);
  const [showedRole, setShowedRole] = useState(false);

  const toggle = () => {
    if (!showedRole) {
      if (localPlayerAmount > 1) {
        setShowedRole(true); // Only disable showing role if there are other local players as per issue #172
      }
    }
    if (!showRole) logEvent('PLAYER_VIEW_ROLE');
    setShowRole((prevShowRole) => !prevShowRole);
  };

  const onPlayerUpdateName = (evt) => {
    onPlayerChange(index, { name: evt.target.value });
  };

  const onSetPlayerModeratorRole = (moderatorRole) => {
    onPlayerChange(index, { moderatorRole });
  };

  useEffect(() => {
    setShowedRole(false);
  }, [started]);

  return (
    <Row className={styles.player}>
      <Col>
        {!started && (
          <Input type="text" name={`player_${index}`} id={`player_${index}`} placeholder="Player" value={player.name} onChange={onPlayerUpdateName} />
        )}
        {!!started && (
          <Button color="success" disabled={showedRole} outline={showedRole} block onClick={toggle}>{player.name}</Button>
        )}
      </Col>
      {!started && moderatorMode && (
        <Col>
          <GameModeratorRoleSelector
            moderatorRole={player.moderatorRole}
            onModeratorRoleChange={onSetPlayerModeratorRole}
          />
        </Col>
      )}
      <RolePopup
        isOpen={showRole}
        toggle={toggle}
        player={player}
        location={location}
        role={role}
        customLocations={customLocations}
      />
    </Row>
  );
};

const styles = {
  player: css({
    paddingTop: 5,
    paddingBottom: 5,
  }),
};

export default React.memo(Player);
