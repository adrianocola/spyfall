import React from 'react';
import { observer, inject } from 'mobx-react';
import {css} from 'emotion';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Locations from 'components/Locations/Locations';
import Localized from 'components/Localized/Localized';

@inject('configStore')
@observer
export default class LocationsPopup extends React.Component{
  render() {
    const { configStore: { gameLocations } } = this.props;
    return (
      <Modal centered isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader tag="h3" toggle={this.props.toggle} className={`${styles.header} justify-content-center`} close={<button type="button" className="close" onClick={this.props.toggle}>&times;</button>}>
          <Localized name="interface.game_locations" />
        </ModalHeader>
        <ModalBody className={styles.body}>
          <Locations locations={gameLocations} />
        </ModalBody>
      </Modal>
    );
  }
}

const styles = {
  header: css({
    borderBottom: 'none',
  }),
  body: css({
    marginBottom: 20,
  }),
};
