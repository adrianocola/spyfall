import React, {useState} from 'react';
import {css} from 'emotion';
import {Col, Row} from 'reactstrap';
import SelectAll from 'components/SelectAll/SelectAll';
import {DEFAULT_LOCATIONS} from 'consts';

import Location from './Location';

export const DefaultLocationsList = ({version, onSelectAll, onDeselectAll}) => {
  const [locations] = useState(() => Object.entries(DEFAULT_LOCATIONS).filter(([key, value]) => value === version).map(([key]) => key));

  return (
    <Row className="justify-content-center">
      <Col>
        <Row className={styles.locationsListNameContainer}>
          <Col className="text-center">
            <h5>Spyfall{version === 1 ? '' : ` ${version}`}</h5>
          </Col>
        </Row>
        <Row className={styles.checksContainer}>
          <Col xs={6} className="text-center">
            <SelectAll checked onClick={() => onSelectAll(locations)} />
          </Col>
          <Col xs={6} className="text-center">
            <SelectAll onClick={() => onDeselectAll(locations)} />
          </Col>
        </Row>
        {locations.map((location) =>
          <Location key={location} locationId={location} disabled />
        )}
      </Col>
    </Row>
  );
};

const styles = {
  locationsListNameContainer: css({
    marginTop: 20,
  }),
  checksContainer: css({
    marginTop: 20,
    marginBottom: 10,
  }),
};

export default DefaultLocationsList;
