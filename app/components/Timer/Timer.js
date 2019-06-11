import _ from 'lodash';
import React, { useState, useRef, useEffect } from 'react';
import { css } from 'emotion';
import { Button } from 'reactstrap';
import beep from 'services/beep';
import {SHADES} from 'styles/consts';

export default ({initialValue, running, onComplete}) => {
  const prevRunningRef = useRef();
  const prevRunning = prevRunningRef.current;

  const [initialTime, setInitialTime] = useState(initialValue);
  const [time, setTime] = useState(initialValue);
  const [finishedRunning, setFinishedRunning] = useState(false);

  // handles start and pauses
  useEffect(() => {
    prevRunningRef.current = running;
    // started...
    if(!prevRunning && running){
      const startTime = Date.now();
      const timeout = setInterval(() => {
        setTime(initialTime - Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timeout);
    }
    // paused...
    if(prevRunning && !running){
      setInitialTime(time);
    }
  }, [running]);


  // handle timer completion
  useEffect(() => {
    if(time <= 0){
      setFinishedRunning(true);
      beep(2);
      if(onComplete) onComplete();
    }
  }, [time]);

  return (
    <Button color="secondary" disabled outline block className={styles.timer}>
      {!finishedRunning && <span>{Math.floor(time / 60)}:{_.padStart(time % 60, 2, '0')}</span>}
      {finishedRunning && <span>--:--</span>}
    </Button>
  );
};

const styles = {
  timer: css({
    color: `${SHADES.darker} !important`,
  }),
};
