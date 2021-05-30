import React from 'react';
import { css } from 'emotion';
import { Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import ResultsSpies from 'components/ResultsSpies/ResultsSpies';
import LocalizedLocation from 'components/LocalizedLocation/LocalizedLocation';
import { useGameSpies } from 'selectors/gameSpies';
import { useGameLocation } from 'selectors/gameLocation';
import { useCustomLocations } from 'selectors/customLocations';

export const LocationsPopup = ({ isOpen, toggle }) => {
  const spies = useGameSpies();
  const location = useGameLocation();
  const { customLocations } = useCustomLocations();
  return (
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
