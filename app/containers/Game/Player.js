import React, { useEffect, useState } from 'react';
import { css } from 'emotion';
import { Button, Col, Input, Row } from 'reactstrap';
import { logEvent } from 'utils/analytics';
import { useConfigPlayer } from 'selectors/configPlayer';
import { useGamePlayerRole } from 'selectors/gamePlayerRole';
import { useGameLocation } from 'selectors/gameLocation';
import { useCustomLocations } from 'selectors/customLocations';
import { useConfigPlayersCount } from 'selectors/configPlayersCount';

import RolePopup from 'components/RolePopup/RolePopup';

export const Player = ({ index, started, onPlayerChange }) => {
  const [player] = useConfigPlayer(index);
  const role = useGamePlayerRole(player);
  const location = useGameLocation();
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

  useEffect(() => {
    setShowedRole(false);
  }, [started]);

  return (
    <Row className={styles.player}>
      <Col>
        {!started &&
          <Input type="text" name={`player_${index}`} id={`player_${index}`} placeholder="Player" value={player} onChange={(evt) => onPlayerChange(index, evt.target.value)} />}
        {!!started &&
          <Button color="success" disabled={showedRole} outline={showedRole} block onClick={toggle}>{player}</Button>}
      </Col>
      <RolePopup isOpen={showRole} toggle={toggle} player={player} location={location} role={role} customLocations={customLocations} />
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
