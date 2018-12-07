import React from 'react';
import {css} from 'emotion';
import {observer} from 'mobx-react';
import { observable } from 'mobx';
import {Col, Input, Row, Button } from 'reactstrap';
import {COLORS} from 'styles/consts';

import RolePopup from 'components/RolePopup/RolePopup';

@observer
export default class Player extends React.Component{
  @observable showRole = false;

  toggle = () => {
    this.showRole = !this.showRole;
  };

  render() {
    const { index, player, started, role, remotePlayer } = this.props;

    const isActive = !!remotePlayer;

    return (
      <Row className={styles.player}>
        <Col>
          {!started &&
            <Input type="text" name={`player_${index}`} id={`player_${index}`} placeholder="Player" value={player} onChange={(evt) => this.props.onPlayerNameChange(index, evt.target.value)} />
          }
          {!!started &&
            <Button color={isActive ? 'secondary' : 'success'} block disabled={isActive} onClick={this.toggle}>{player}</Button>
          }
          {isActive && <div className={styles.isActive}>*</div>}
        </Col>
        <RolePopup isOpen={this.showRole} toggle={this.toggle} player={player} role={role} />
      </Row>
    );
  }
}

const styles = {
  player: css({
    paddingTop: 5,
    paddingBottom: 5,
  }),
  isActive: css({
    position: 'absolute',
    right: 25,
    top: 10,
    color: COLORS.red,
  }),
};
