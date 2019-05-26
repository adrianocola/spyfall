import React from 'react';
import { css } from 'emotion';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import Timer from 'components/Timer/Timer';
import { updateGame } from 'services/game';

export const TimerManager = (props) => {
  const {time, timerRunning} = props;

  return (
    <Row className={`${styles.timerContainer} align-items-center justify-content-center`}>
      <Col>
        <Button color={timerRunning ? 'primary' : 'success'} block onClick={() => updateGame({timerRunning: !timerRunning})}>
          <Localized name={timerRunning ? 'interface.pause_timer' : 'interface.start_timer'} />
        </Button>
      </Col>
      <Col>
        <Timer initialValue={time} running={timerRunning} onComplete={() => updateGame({timerRunning: false})} />
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
