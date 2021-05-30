import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { css } from 'emotion';
import { Button } from 'reactstrap';
import beep from 'services/beep';
import { DARK_COLORS, SHADES } from 'styles/consts';

import Countdown from './Countdown';

const END_ANIMATION = 'animate__animated animate__flash animate__infinite animate__slow';

export const Timer = ({ initialValue, showCountdown, running, onComplete, onCountdownComplete }) => {
  const prevRunningRef = useRef();
  const prevRunning = prevRunningRef.current;

  const [time, setTime] = useState(initialValue);
  const [finishedRunning, setFinishedRunning] = useState(false);
  const [animateEnd, setAnimateEnd] = useState(true);
  const timerIntervalRef = useRef();

  const toggleEndAnimation = () => {
    setAnimateEnd((prevAnimateEnd) => !prevAnimateEnd);
  };

  const clearTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    timerIntervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);
    return clearTimer;
  }, [clearTimer]);

  // started/resumed...
  useEffect(() => {
    if (!prevRunning && running) {
      return startTimer();
    }
  }, [prevRunning, running, startTimer]);

  // paused...
  useEffect(() => {
    if (prevRunning && !running) {
      clearTimer();
    }
  }, [clearTimer, prevRunning, running]);

  // handle timer completion
  useEffect(() => {
    if (time <= 0) {
      beep(2);
      setFinishedRunning(true);
      if (onComplete) onComplete();
    }
  }, [onComplete, time]);

  return (
    <Button color={finishedRunning ? 'danger' : 'secondary'} disabled outline block className={styles.timer}>
      {!finishedRunning && (
        <div>
          <span>{Math.floor(time / 60)}:{_.padStart(time % 60, 2, '0')}</span>
          <Countdown showCountdown={showCountdown} running={running} onCountdownComplete={onCountdownComplete} />
        </div>
      )}
      {finishedRunning && (
        <div
          className={`${styles.finished} ${animateEnd ? END_ANIMATION : ''}`}
          onMouseUp={toggleEndAnimation}
        >
          0:00
        </div>
      )}
    </Button>
  );
};

const styles = {
  timer: css({
    color: `${SHADES.darker} !important`,
  }),
  finished: css({
    color: `${DARK_COLORS.red} !important`,
  }),
};

export default React.memo(Timer);
