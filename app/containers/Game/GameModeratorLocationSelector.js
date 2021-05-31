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
  const [moderationLocation, setModerationLocation] = useConfigModeratorLocation();

  const sortedLocations = useSortedLocationsList(gameLocations);

  const onSetModerationLocation = useCallback((evt) => {
    const newModerationLocation = evt.target.value;
    logEvent('GAME_SET_MODERATION_LOCATION', newModerationLocation);
    setModerationLocation(newModerationLocation);
  }, [setModerationLocation]);

  return (
    <Row className={`${styles.container} align-items-center justify-content-center`}>
      <Col xs="auto" className="text-center">
        <Input type="select" name="select" id="timer" value={moderationLocation} onChange={onSetModerationLocation}>
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
