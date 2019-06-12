import React, { useState, useEffect } from 'react';
import {css} from 'emotion';
import { connect } from 'react-redux';
import {Col, Input, Row, Button } from 'reactstrap';
import {logEvent} from 'utils/analytics';

import RolePopup from 'components/RolePopup/RolePopup';

export const Player = ({index, player, started, location, role, customLocations, onPlayerChange}) => {
  const [showRole, setShowRole] = useState(false);
  const [showedRole, setShowedRole] = useState(false);

  const toggle = () => {
    if(!showedRole){
      setShowedRole(true);
    }
    if(!showRole) logEvent('PLAYER_VIEW_ROLE');
    setShowRole((prevShowRole) => !prevShowRole);
  };

  useEffect(() => {
    setShowedRole(false);
  }, [started]);

  return (
    <Row className={styles.player}>
      <Col>
        {!started &&
          <Input type="text" name={`player_${index}`} id={`player_${index}`} placeholder="Player" value={player} onChange={(evt) => onPlayerChange(index, evt.target.value)} />
        }
        {!!started &&
          <Button color="success" disabled={showedRole} outline={showedRole} block onClick={toggle}>{player}</Button>
        }
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

const mapStateToProps = (state, ownProps) => {
  const player = state.config.players[ownProps.index];
  return {
    player,
    role: state.game.playersRoles[player],
    location: state.game.location,
    customLocations: state.config.customLocations,
  };
};

export default connect(mapStateToProps)(Player);
