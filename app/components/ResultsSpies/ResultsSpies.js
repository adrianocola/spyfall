import React from 'react';
import { css } from 'emotion';
import { Row, Col } from 'reactstrap';
import SpyIcon from 'components/SpyIcon/SpyIcon';

const CogIcon = ({ className, spies = [], remotePlayers = {} }) => (
  <Row className={className}>
    {spies.map((playerId) => (
      <Col xs={12} key={playerId} className={`${styles.item} text-center`}>
        <SpyIcon className={styles.spyIcon} /><span>{remotePlayers && remotePlayers[playerId] ? remotePlayers[playerId].name : playerId}</span>
      </Col>
    )
    )}
  </Row>
);

export default CogIcon;

const styles = {
  item: css({
    marginTop: 5,
  }),
  spyIcon: css({
    marginRight: 10,
  }),
};
