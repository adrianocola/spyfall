import React from 'react';
import { css } from 'emotion';
import { Button, Col, Row } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import Timer from 'components/Timer/Timer';
import { updateGame } from 'services/game';
import { logEvent } from 'utils/analytics';
import { useConfigTime } from 'selectors/configTime';
import { useGameTimeRunning } from 'selectors/gameTimeRunning';

export const TimerManager = () => {
  const [time] = useConfigTime();
  const timerRunning = useGameTimeRunning();
  const toggleTimer = () => {
    logEvent(timerRunning ? 'TIMER_STOP' : 'TIMER_START');
    updateGame({ timerRunning: !timerRunning });
  };

  const stopTimer = () => {
    logEvent('TIMER_END');
    updateGame({ timerRunning: false });
  };

  return (
    <Row className={`${styles.timerContainer} align-items-center justify-content-center`}>
      <Col>
        <Button color={timerRunning ? 'primary' : 'success'} block onClick={toggleTimer}>
          <Localized name={timerRunning ? 'interface.pause_timer' : 'interface.start_timer'} />
        </Button>
      </Col>
      <Col>
        <Timer initialValue={time} running={timerRunning} onComplete={stopTimer} />
      </Col>
    </Row>
  );
};

const styles = {
  timerContainer: css({
    marginTop: 20,
  }),
};

export default React.memo(TimerManager);
