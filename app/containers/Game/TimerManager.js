import React, { useCallback, useState } from 'react';
import { css } from 'emotion';
import { Button, Col, Row } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import Timer from 'components/Timer/Timer';
import { updateGame } from 'services/game';
import { logEvent } from 'utils/analytics';
import { useConfigTime } from 'selectors/configTime';
import { useGameTimeRunning } from 'selectors/gameTimeRunning';
import { useGameShowCountdown } from 'selectors/gameShowCountdown';

export const TimerManager = () => {
  const [time] = useConfigTime();
  const timerRunning = useGameTimeRunning();
  const showCountdown = useGameShowCountdown();
  const [timerCompleted, setTimerCompleted] = useState(false);

  const toggleTimer = useCallback(() => {
    logEvent(timerRunning ? 'TIMER_STOP' : 'TIMER_START');
    updateGame({ timerRunning: !timerRunning, showCountdown: false });
  }, [timerRunning]);

  const stopTimer = useCallback(() => {
    setTimerCompleted(true);
    logEvent('TIMER_END');
    updateGame({ time: 0, timerRunning: false, showCountdown: false });
  }, []);

  return (
    <Row className={`${styles.timerContainer} align-items-center justify-content-center`}>
      <Col>
        <Button color={timerRunning ? 'primary' : 'success'} block onClick={toggleTimer} disabled={timerCompleted}>
          <Localized name={timerRunning ? 'interface.pause_timer' : 'interface.start_timer'} />
        </Button>
      </Col>
      <Col>
        <Timer
          initialValue={time}
          showCountdown={showCountdown}
          running={timerRunning}
          onComplete={stopTimer}
          onCountdownComplete={toggleTimer}
        />
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
