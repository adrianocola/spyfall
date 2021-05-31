import _ from 'lodash';
import React, { useCallback } from 'react';
import { Col, Input, Row } from 'reactstrap';
import { RANDOM } from 'consts';
import { logEvent } from 'utils/analytics';
import { useGameLocations } from 'selectors/gameLocations';
import { useConfigModeratorLocation } from 'selectors/configModeratorLocation';
import useSortedLocationsList from 'hooks/useSortedLocationsList';
import { css } from 'emotion';

export const GameModeratorLocationSelector = () => {
  const gameLocations = useGameLocations();
  const [moderatorLocation, setModeratorLocation] = useConfigModeratorLocation();

  const sortedLocations = useSortedLocationsList(gameLocations);

  const onSetModeratorLocation = useCallback((evt) => {
    const newModeratorLocation = evt.target.value;
    logEvent('GAME_SET_MODERATOR_LOCATION', newModeratorLocation);
    setModeratorLocation(newModeratorLocation);
  }, [setModeratorLocation]);

  return (
    <Row className={`${styles.container} align-items-center justify-content-center`}>
      <Col xs="auto" className="text-center">
        <Input type="select" name="select" id="timer" value={moderatorLocation} onChange={onSetModeratorLocation}>
          <option value={RANDOM}>🎲</option>
          {_.map(sortedLocations, (location) => (
            <option key={location.locationId} value={location.locationId}>{location.name}</option>
          ))}
        </Input>
      </Col>
    </Row>
  );
};

const styles = {
  container: css({
    paddingTop: 10,
    paddingBottom: 10,
  }),
};

export default React.memo(GameModeratorLocationSelector);
