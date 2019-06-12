import React from 'react';
import {css} from 'emotion';
import {connect} from 'react-redux';
import {Button, Col, Row} from 'reactstrap';
import Localized from 'components/Localized/Localized';
import Timer from 'components/Timer/Timer';
import {updateGame} from 'services/game';
import {logEvent} from 'utils/analytics';

export const TimerManager = ({time, timerRunning}) => {
  const toggleTimer = () => {
    logEvent(timerRunning ? 'TIMER_STOP' : 'TIMER_START');
    updateGame({timerRunning: !timerRunning});
  };

  const stopTimer = () => {
    logEvent('TIMER_END');
    updateGame({timerRunning: false});
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

const mapStateToProps = (state) => ({
  time: state.config.time,
  timerRunning: state.game.timerRunning,
});

export default connect(mapStateToProps)(TimerManager);
