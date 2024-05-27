import React, { useCallback, useEffect, useRef, useState } from 'react';
import { css } from 'emotion';

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

  return <div className={`${styles.countdown} text-danger`}>{countdown}</div>;
};

const styles = {
  countdown: css({
    position: 'absolute',
    top: 9,
    right: 25,
    fontSize: 14,
  }),
};

export default React.memo(Countdown);
