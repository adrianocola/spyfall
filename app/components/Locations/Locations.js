import _ from 'lodash';
import React, { useMemo, useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';
import { css } from 'emotion';
import { DARK_COLORS, SHADES } from 'styles/consts';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LOCATIONS } from 'consts';

export const Locations = ({ location, locations = {}, prevLocation }) => {
  const [t] = useTranslation();
  const [sortedLocations, updateSortedLocations] = useState([]);

  useEffect(() => {
    updateSortedLocations(initialLocations);
  }, [initialLocations]);

  const initialLocations = useMemo(() => {
    const locationsArray = _.map(locations, (locationObj, locationId) => ({
      ...locationObj,
      name: DEFAULT_LOCATIONS[locationId]
        ? t(`location.${locationId}`)
        : locationObj.name,
      locationId,
      crossOut: false,
    }));
    return _.orderBy(locationsArray, 'name');
  }, [locations, t]);

  const locationsChunks = useMemo(() => {
    const chunkLength = Math.ceil(Math.max(sortedLocations.length / 2, 1));
    return [
      sortedLocations.slice(0, chunkLength),
      sortedLocations.slice(chunkLength),
    ];
  }, [sortedLocations]);
  const locationsLeft = useMemo(() => locationsChunks[0], [locationsChunks]);
  const locationsRight = useMemo(() => locationsChunks[1], [locationsChunks]);

  const crossOutLocation = (selected) => {
    const locationsCopy = [...sortedLocations]; // makes copy of locations
    const index = locationsCopy.indexOf(selected); // gets index of selected location
    const itemToUpdate = locationsCopy[index]; // selects location to update
    itemToUpdate.crossOut = !itemToUpdate.crossOut; // sets bool to determine if crossed out
    updateSortedLocations(locationsCopy); // updates are main sortedLocations array
  };

  return (
    <Container>
      <Row>
        <Col xs={6}>
          {locationsLeft.map((locationObj) => (
            <Row key={locationObj.locationId}>
              <Col>
                <div
                  onClick={() => crossOutLocation(locationObj)}
                  className={`${styles.location} 
                    ${
            prevLocation === locationObj.locationId
              ? styles.prevLocation
              : ''
            } ${
              locationObj.crossOut && prevLocation !== undefined
                ? styles.crossedOut
                : ''
            } ${
              location === locationObj.locationId ? styles.highlight : ''
            }`}
                >
                  {ReactHtmlParser(locationObj.name)}
                </div>
              </Col>
            </Row>
          ))}
        </Col>
        <Col xs={6}>
          {locationsRight.map((locationObj) => (
            <Row key={locationObj.locationId}>
              <Col>
                <div
                  onClick={() => crossOutLocation(locationObj)}
                  className={`${styles.location} 
                    ${
            prevLocation === locationObj.locationId
              ? styles.prevLocation
              : ''
            } ${
              locationObj.crossOut && prevLocation !== undefined
                ? styles.crossedOut
                : ''
            } ${
              location === locationObj.locationId ? styles.highlight : ''
            }`}
                >
                  {ReactHtmlParser(locationObj.name)}
                </div>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

const styles = {
  location: css({
    borderBottom: `1px solid ${SHADES.lighter}`,
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    cursor: 'pointer',
    userSelect: 'none',
  }),
  prevLocation: css({
    textDecoration: 'line-through',
    cursor: 'default',
  }),
  crossedOut: css({
    textDecoration: 'line-through',
  }),
  highlight: css({
    fontWeight: 'bold',
    color: DARK_COLORS.red,
  }),
};

export default Locations;
