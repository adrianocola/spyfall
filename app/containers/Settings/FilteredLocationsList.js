import _ from 'lodash';
import React, { useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import { DEFAULT_LOCATIONS } from 'consts';
import { useTranslation } from 'react-i18next';
import { css } from 'emotion';
import { useCustomLocations } from 'selectors/customLocations';

import Location from './Location';

export const FilteredLocationsList = ({ filter }) => {
  const [t] = useTranslation();
  const { customLocations } = useCustomLocations();

  const filteredLocations = useMemo(() => {
    const filtered = [];
    const lcFilter = filter?.toLowerCase();
    Object.entries(DEFAULT_LOCATIONS).forEach(([locationId, version]) => {
      const locationName = t(`location.${locationId}`);
      const lcLocationName = locationName?.toLowerCase();
      if (lcLocationName?.includes(lcFilter)) {
        filtered.push({ locationId, locationName, description: `Spyfall ${version}`, def: true });
      }
    });
    const customDescription = t('interface.game_locations_custom');
    Object.entries(customLocations).forEach(([locationId, location]) => {
      const locationName = location?.name;
      const lcLocationName = locationName?.toLowerCase();
      if (lcLocationName?.includes(lcFilter)) {
        filtered.push({ locationId, locationName, description: customDescription, location });
      }
    });
    return _.orderBy(filtered, 'locationName');
  }, [t, customLocations, filter]);

  return (
    <Row className={`${styles.container} justify-content-center`}>
      <Col>
        <Row className="justify-content-center">
          <Col>
            {filteredLocations.map(({ locationId, location, description, def }) => (
              <Location
                key={locationId}
                locationId={locationId}
                location={location}
                description={description}
                disabled={def}
              />
            ))}
          </Col>
        </Row>
        {filteredLocations.length === 0 && (
          <Row className="text-center"><Col>¯\_( ●__● )_/¯</Col></Row>
        )}
      </Col>
    </Row>

  );
};

const styles = {
  container: css({
    paddingTop: 20,
    paddingBottom: 10,
  }),
};

export default React.memo(FilteredLocationsList);
