import React from 'react';
import { css } from 'emotion';
import { Row, Col } from 'reactstrap';
import SpyIcon from 'components/SpyIcon/SpyIcon';

const ResultsSpies = ({ className, spies = [], remotePlayers = {} }) => (
  <Row className={className}>
    {spies.map((playerId, index) => (
      <Col xs={12} key={index} className={`${styles.item} text-center`}>
        <SpyIcon className={styles.spyIcon} /><span>{remotePlayers && remotePlayers[playerId] ? remotePlayers[playerId].name : playerId}</span>
      </Col>
    ))}
  </Row>
);

const styles = {
  item: css({
    marginTop: 5,
  }),
  spyIcon: css({
    marginRight: 10,
  }),
};

export default React.memo(ResultsSpies);
