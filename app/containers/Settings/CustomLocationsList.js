import React from 'react';
import { css } from 'emotion';
import { connect } from 'react-redux';
import { Row, Col, Button} from 'reactstrap';
import Localized from 'components/Localized/Localized';
import SelectAll from 'components/SelectAll/SelectAll';
import { createCustomLocationAction } from 'actions/config';

import Location from './Location';

export const CustomLocationsList = ({customLocations, onSelectAll, onDeselectAll, createCustomLocation}) => (
  <Row className="justify-content-center">
    <Col>
      <Row className={styles.locationsListNameContainer}>
        <Col className="text-center">
          <h5><Localized name="interface.game_locations_custom" /></h5>
        </Col>
      </Row>
      <Row className={styles.checksContainer}>
        <Col xs={6} className="text-center">
          <SelectAll checked onClick={() => onSelectAll(Object.keys(customLocations))} />
        </Col>
        <Col xs={6} className="text-center">
          <SelectAll onClick={() => onDeselectAll(Object.keys(customLocations))} />
        </Col>
      </Row>
      {Object.entries(customLocations).map(([id, location]) =>
        <Location key={id} locationId={id} location={location} />
      )}
      <Row className={styles.addCustomLocation}>
        <Col>
          <Button color="primary" block onClick={() => createCustomLocation()}><Localized name="interface.add_location" /></Button>
        </Col>
      </Row>
    </Col>
  </Row>
);

const styles = {
  locationsListNameContainer: css({
    marginTop: 20,
  }),
  checksContainer: css({
    marginTop: 20,
    marginBottom: 10,
  }),
  addCustomLocation: css({
    marginTop: 30,
  }),
};

const mapStateToProps = (state) => ({
  customLocations: state.config.customLocations,
});

const mapDispatchToProps = (dispatch) => ({
  createCustomLocation: () => dispatch(createCustomLocationAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomLocationsList);
