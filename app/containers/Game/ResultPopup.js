import React from 'react';
import { connect } from 'react-redux';
import {css} from 'emotion';
import { Row, Col, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import ResultsSpies from 'components/ResultsSpies/ResultsSpies';
import LocalizedLocation from 'components/LocalizedLocation/LocalizedLocation';

export const LocationsPopup = ({isOpen, toggle, location, customLocations, spies}) => (
  <Modal centered isOpen={isOpen} toggle={toggle}>
    <ModalHeader tag="h3" toggle={toggle} className={`${styles.header} justify-content-center`} close={<button type="button" className="close" onClick={toggle}>&times;</button>}>
      <Localized name="interface.game_information" />
    </ModalHeader>
    <ModalBody className={styles.body}>
      <Row>
        <Col className="text-center">
          <h4>
            <LocalizedLocation location={location} customLocations={customLocations} />
          </h4>
        </Col>
      </Row>
      <ResultsSpies spies={spies} />
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
  spies: state.game.spies,
  location: state.game.location,
  customLocations: state.config.customLocations,
});

export default connect(mapStateToProps)(LocationsPopup);
