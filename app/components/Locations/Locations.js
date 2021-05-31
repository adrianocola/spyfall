import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import useSortedLocationsList from 'hooks/useSortedLocationsList';

import Location from './Location';

const resetLocationsState = (locations, prevLocation) => {
  const state = {};
  _.forEach(locations, (locationObj, locationId) => {
    state[locationId] = {
      highlight: false,
      previous: locationId === prevLocation,
      crossedOut: false,
    };
  });

  return state;
};

export const Locations = ({ matchId, location, locations = {}, prevLocation }) => {
  const sortedLocations = useSortedLocationsList(locations);

  const [locationsState, setLocationsState] = useState({});

  // only reset state if changed match
  useEffect(() => {
    setLocationsState(resetLocationsState(locations, prevLocation));
  }, [matchId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (location) {
      setLocationsState((prevLocationsState) => ({
        ...prevLocationsState,
        [location]: {
          ...prevLocationsState[location],
          highlight: true,
        },
      }));
    }
  }, [location]);

  const locationsChunks = useMemo(() => {
    const chunkLength = Math.ceil(Math.max(sortedLocations.length / 2, 1));
    return [
      sortedLocations.slice(0, chunkLength),
      sortedLocations.slice(chunkLength),
    ];
  }, [sortedLocations]);

  const locationsLeft = useMemo(() => locationsChunks[0], [locationsChunks]);
  const locationsRight = useMemo(() => locationsChunks[1], [locationsChunks]);

  const crossOutLocation = (locationObj) => {
    const id = locationObj.locationId;
    setLocationsState((prevLocationsState) => ({
      ...prevLocationsState,
      [id]: {
        ...prevLocationsState[id],
        crossedOut: !prevLocationsState[id]?.crossedOut,
      },
    }));
  };

  return (
    <Container>
      <Row>
        <Col xs={6}>
          {locationsLeft.map((locationObj) => (
            <Location
              key={locationObj.locationId}
              locationObj={locationObj}
              crossOutLocation={crossOutLocation}
              state={locationsState[locationObj.locationId] || {}}
            />
          ))}
        </Col>
        <Col xs={6}>
          {locationsRight.map((locationObj) => (
            <Location
              key={locationObj.locationId}
              locationObj={locationObj}
              crossOutLocation={crossOutLocation}
              state={locationsState[locationObj.locationId] || {}}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default React.memo(Locations);
