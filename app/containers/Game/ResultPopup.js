import React from 'react';
import { connect } from 'react-redux';
import {css} from 'emotion';
import { Row, Col, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import ResultsSpies from 'components/ResultsSpies/ResultsSpies';
import LocalizedLocation from 'components/LocalizedLocation/LocalizedLocation';

export const LocationsPopup = (props) => (
  <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
    <ModalHeader tag="h3" toggle={props.toggle} className={`${styles.header} justify-content-center`} close={<button type="button" className="close" onClick={props.toggle}>&times;</button>}>
      <Localized name="interface.game_information" />
    </ModalHeader>
    <ModalBody className={styles.body}>
      <Row>
        <Col className="text-center">
          <h4>
            <LocalizedLocation location={props.location} customLocations={props.customLocations} />
          </h4>
        </Col>
      </Row>
      <ResultsSpies spies={props.spies} remotePlayers={props.remotePlayers} />
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
