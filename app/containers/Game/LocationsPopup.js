import React from 'react';
import { connect } from 'react-redux';
import {css} from 'emotion';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import gameLocationsSelector from 'selectors/gameLocations';
import Locations from 'components/Locations/Locations';
import Localized from 'components/Localized/Localized';


export const LocationsPopup = ({isOpen, toggle, gameLocations}) => (
  <Modal centered isOpen={isOpen} toggle={toggle}>
    <ModalHeader tag="h3" toggle={toggle} className={`${styles.header} justify-content-center`} close={<button type="button" className="close" onClick={toggle}>&times;</button>}>
      <Localized name="interface.game_locations" />
    </ModalHeader>
    <ModalBody className={styles.body}>
      <Locations locations={gameLocations} />
    </ModalBody>
  </Modal>
);

const styles = {
  header: css({
    borderBottom: 'none',
  }),
  body: css({
    marginBottom: 20,
  }),
};

const mapStateToProps = (state) => ({
  gameLocations: gameLocationsSelector(state),
});

export default connect(mapStateToProps)(LocationsPopup);
