import React, { useState } from 'react';
import { css } from 'emotion';
import { Col, Row } from 'reactstrap';
import SelectAll from 'components/SelectAll/SelectAll';
import { DEFAULT_LOCATIONS } from 'consts';
import { logEvent } from 'utils/analytics';

import Location from './Location';

export const DefaultLocationsList = ({ version, onSelectAll, onDeselectAll }) => {
  const [locations] = useState(() => {
    const initialLocations = [];
    Object.entries(DEFAULT_LOCATIONS).forEach(([key, value]) => {
      if (value === version) {
        initialLocations.push(key);
      }
    });
    return initialLocations;
  });

  const onSelectAllClick = () => {
    logEvent('SETTINGS_ON_SELECT_ALL');
    onSelectAll(locations);
  };

  const onDeselectAllClick = () => {
    logEvent('SETTINGS_ON_DESELECT_ALL');
    onDeselectAll(locations);
  };

  return (
    <Row className="justify-content-center">
      <Col>
        <Row className={styles.locationsListNameContainer}>
          <Col className="text-center">
            <h5>Spyfall {version}</h5>
          </Col>
        </Row>
        <Row className={styles.checksContainer}>
          <Col xs={6} className="text-center">
            <SelectAll checked onClick={onSelectAllClick} />
          </Col>
          <Col xs={6} className="text-center">
            <SelectAll onClick={onDeselectAllClick} />
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

export default React.memo(DefaultLocationsList);
