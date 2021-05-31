import React from 'react';
import { Row, Col, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { css } from 'emotion';
import SpyIcon from 'components/SpyIcon/SpyIcon';
import Localized from 'components/Localized/Localized';
import LocalizedLocation from 'components/LocalizedLocation/LocalizedLocation';
import LocalizedRole from 'components/LocalizedRole/LocalizedRole';
import { SPY_ROLE, SPY_LOCATION } from 'consts';

export const RolePopup = ({ isOpen, toggle, player, location, role, customLocations }) => (
  <Modal centered isOpen={isOpen} toggle={toggle}>
    <ModalHeader tag="h3" toggle={toggle} className={`${styles.header} justify-content-center`} close={<button type="button" className="close" onClick={toggle}>&times;</button>}>
      {player.name ?? player}
    </ModalHeader>
    <ModalBody className={styles.body}>
      <Row className={styles.roleLine}>
        <Col className="text-center">
          <span className={styles.label}><Localized name="interface.location" />: </span>
          <span className={styles.value}>
            {role === SPY_ROLE ? SPY_LOCATION : <LocalizedLocation location={location} customLocations={customLocations} />}
          </span>
        </Col>
      </Row>
      {!!role && (
        <Row className={styles.roleLine}>
          <Col className="text-center">
            <span className={styles.label}><Localized name="interface.role" />: </span>
            <span className={styles.value}>
              {role === SPY_ROLE ? <SpyIcon /> : <LocalizedRole role={role} location={location} customLocations={customLocations} />}
            </span>
          </Col>
        </Row>
      )}
    </ModalBody>
  </Modal>
);

const styles = {
  roleLine: css({
    marginTop: 10,
    marginBottom: 10,
  }),
  label: css({
    fontWeight: 'bold',
    fontSize: '1.5rem',
  }),
  value: css({
    fontSize: '1.4rem',
  }),
};

export default React.memo(RolePopup);
