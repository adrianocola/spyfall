import React from 'react';
import { css } from 'emotion';
import { Col, Row } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import Locations from 'components/Locations/Locations';
import { useGameLocations } from 'selectors/gameLocations';
import { useSelectedLocationsCount } from 'selectors/selectedLocationsCount';
import { useConfigSpyCount } from 'selectors/configSpyCount';
import { useGamePrevLocation } from 'selectors/gamePrevLocation';
import { useGameMatchId } from 'selectors/gameMatchId';
import SpyCount from 'components/SpyCount/SpyCount';
import { useGameSpies } from 'selectors/gameSpies';
import { useConfigHideSpyCount } from 'selectors/configHideSpyCount';
import { useGameAllSpies } from 'selectors/gameAllSpies';

import TimerManager from './TimerManager';

export const GameInfo = () => {
  const [spyCount] = useConfigSpyCount();
  const prevLocation = useGamePrevLocation();
  const matchId = useGameMatchId();
  const spies = useGameSpies();
  const [hideSpyCount] = useConfigHideSpyCount();
  const allSpies = useGameAllSpies();
  const selectedLocationsCount = useSelectedLocationsCount();
  const gameLocations = useGameLocations();

  return (
    <div>
      <SpyCount
        spyCount={spyCount}
        spies={spies}
        allSpies={allSpies}
        hideSpyCount={hideSpyCount}
        className={styles.spiesCountContainer}
      />
      <Row className={styles.locationsContainer}>
        <Col className="text-center">
          <h4><Localized name="interface.game_locations" /> ({selectedLocationsCount})</h4>
        </Col>
      </Row>
      <Locations matchId={matchId} locations={gameLocations} prevLocation={prevLocation} />
      <TimerManager />
    </div>
  );
};

const styles = {
  spiesCountContainer: css({
    marginTop: 20,
  }),
  locationsContainer: css({
    marginTop: 20,
  }),
};

export default React.memo(GameInfo);
