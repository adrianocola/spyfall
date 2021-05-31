import React, { useCallback, useEffect, useRef, useState } from 'react';
import { css } from 'emotion';
import { DARK_COLORS, SHADES } from 'styles/consts';

const COUNTDOWN_TIME_SEC = 15;

export const Countdown = ({ showCountdown, running, onCountdownComplete }) => {
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME_SEC);
  const countdownIntervalRef = useRef();

  const clearCountdownInterval = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const startCountdownTimer = useCallback(() => {
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prevStartTime) => prevStartTime - 1);
    }, 1000);

    return clearCountdownInterval;
  }, [clearCountdownInterval]);

  // handle countdown start
  useEffect(() => {
    if (!showCountdown || running) return clearCountdownInterval();

    return startCountdownTimer();
  }, [running, showCountdown, clearCountdownInterval, startCountdownTimer]);

  // handle countdown completion
  useEffect(() => {
    if (showCountdown && countdown <= 0) {
      clearCountdownInterval();
      if (onCountdownComplete) onCountdownComplete();
    }
  }, [showCountdown, countdown, clearCountdownInterval, onCountdownComplete]);

  if (!showCountdown) return null;

  return <div className={styles.countdown}>{countdown}</div>;
};

const styles = {
  timer: css({
    color: `${SHADES.darker} !important`,
  }),
  countdown: css({
    position: 'absolute',
    top: 9,
    right: 25,
    fontSize: 14,
    color: `${DARK_COLORS.red} !important`,
  }),
  finished: css({
    color: `${DARK_COLORS.red} !important`,
  }),
};

export default React.memo(Countdown);
