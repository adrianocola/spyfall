import React from 'react';
import { observer } from 'mobx-react';
import { css } from 'emotion';
import {Row, Col, Button, Container} from 'reactstrap';
import Localized from 'components/Localized/Localized';
import { Link } from 'react-router-dom';
import { Document } from 'firestorter';
import {computed, observable} from 'mobx';

import Locations from 'components/Locations/Locations';
import RolePopup from 'components/RolePopup/RolePopup';

@observer
export default class RoomClient extends React.Component{
  @observable showRole = false;

  @computed get started() {
    return this.room.data.state === 'started';
  }

  @computed get stopped() {
    return this.room.data.state === 'stopped';
  }

  constructor(props) {
    super(props);

    this.room = new Document(`rooms/${props.roomId}`);
  }

  toggleShowRole = () => {
    this.showRole = !this.showRole;
  };

  render() {
    const { player } = this.props;
    const { locations = {}, playersRoles = {} } = this.room.data;
    const locationsSize = Object.keys(locations).length;

    return (
      <Container className={styles.container}>
        <Row className={styles.stateContainer}>
          <Col>
            {this.started && <Button color="success" block onClick={this.toggleShowRole}><Localized name="interface.show_my_role" /></Button>}
            {this.stopped && <Button color="danger" outline disabled block><Localized name="interface.game_stopped" /></Button>}
            {!this.started && !this.stopped && <Button color="primary" outline disabled block><Localized name="interface.game_connected" /></Button>}
          </Col>
        </Row>
        <RolePopup isOpen={this.showRole} toggle={this.toggleShowRole} player={player} role={playersRoles[player]} />
        <Row className={styles.stateContainer}>
          <Col className="text-center">
            <h4><Localized name="interface.game_locations" /> ({locationsSize})</h4>
          </Col>
        </Row>
        <Locations locations={locations} />
        <Row className={`${styles.linkContainer} justify-content-center`}>
          <Col>
            <Link className={styles.backLink} to="/">
              <Button color="danger" block><Localized name="interface.leave_room" /></Button>
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
  stateContainer: css({
    marginBottom: 20,
  }),
  linkContainer: css({
    marginTop: 50,
  }),
  backLink: css({
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'none',
    },
  }),
};
