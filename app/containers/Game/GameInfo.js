import _ from 'lodash';
import React from 'react';
import {css} from 'emotion';
import {connect} from 'react-redux';
import {Col, Row} from 'reactstrap';
import Localized from 'components/Localized/Localized';
import Locations from 'components/Locations/Locations';
import gameLocationsSelector from 'selectors/gameLocations';
import selectedLocationsCountSelector from 'selectors/selectedLocationsCount';

import SpyIcon from 'components/SpyIcon/SpyIcon';
import TimerManager from './TimerManager';

export const GameInfo = ({matchId, gameLocations, spyCount, prevLocation, selectedLocationsCount}) => (
  <div>
    <Row className={styles.spiesCountContainer}>
      <Col className="text-center">
        {_.times(spyCount).map((i) => <SpyIcon key={i} />)}
      </Col>
    </Row>
    <Row className={styles.locationsContainer}>
      <Col className="text-center">
        <h4><Localized name="interface.game_locations" /> ({selectedLocationsCount})</h4>
      </Col>
    </Row>
    <Locations matchId={matchId} locations={gameLocations} prevLocation={prevLocation} />
    <TimerManager />
  </div>
);

const styles = {
  spiesCountContainer: css({
    marginTop: 20,
  }),
  locationsContainer: css({
    marginTop: 20,
  }),
};

const mapStateToProps = (state) => ({
  gameLocations: gameLocationsSelector(state),
  selectedLocationsCount: selectedLocationsCountSelector(state),
  spyCount: state.config.spyCount,
  prevLocation: state.game.prevLocation,
  matchId: state.game.matchId,
});

export default connect(mapStateToProps)(GameInfo);
