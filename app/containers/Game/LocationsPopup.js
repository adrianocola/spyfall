import React from 'react';
import { css } from 'emotion';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useGameLocations } from 'selectors/gameLocations';
import Locations from 'components/Locations/Locations';
import Localized from 'components/Localized/Localized';

export const LocationsPopup = ({ isOpen, toggle }) => {
  const gameLocations = useGameLocations();
  return (
    <Modal centered isOpen={isOpen} toggle={toggle}>
      <ModalHeader tag="h3" toggle={toggle} className={`${styles.header} justify-content-center`} close={<button type="button" className="close" onClick={toggle}>&times;</button>}>
        <Localized name="interface.game_locations" />
      </ModalHeader>
      <ModalBody className={styles.body}>
        <Locations locations={gameLocations} />
      </ModalBody>
    </Modal>
  );
};

const styles = {
  header: css({
    borderBottom: 'none',
  }),
  body: css({
    marginBottom: 20,
  }),
};

export default React.memo(LocationsPopup);
