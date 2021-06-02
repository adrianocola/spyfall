import React from 'react';
import { css } from 'emotion';
import { Col, Row } from 'reactstrap';
import Localized from 'components/Localized/Localized';

const ModeratorMode = () => (
  <Row className={`${styles.container} align-items-center justify-content-center`}>
    <Col xs="auto" className="text-center">
      <Localized className={`${styles.text} text-muted`} name="interface.moderator_mode" />
    </Col>
  </Row>
);

const styles = {
  container: css({
    marginTop: 5,
    marginBottom: 5,
  }),
  text: css({
    fontSize: 14,
  }),
};

export default React.memo(ModeratorMode);
