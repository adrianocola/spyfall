import React from 'react';
import { css } from 'emotion';
import { Row, Col } from 'reactstrap';
import {SHADES} from 'styles/consts';

export default ({checked, onClick}) => (
  <Row className="justify-content-center align-items-center">
    <Col xs="auto" className={styles.checksContainer} onClick={onClick}>
      <input type="checkbox" checked={checked} disabled className={styles.checkbox} />
      <input type="checkbox" checked={checked} disabled className={styles.checkbox} />
      <input type="checkbox" checked={checked} disabled className={styles.checkbox} />
    </Col>
  </Row>
);

const styles = {
  checksContainer: css({
    display: 'inline-block',
    border: `1px solid ${SHADES.lighter}`,
    padding: '0px 5px 3px 5px',
    cursor: 'pointer',
    ':hover': {
      borderColor: SHADES.light,
    },
  }),
  checkbox: css({
    marginLeft: 2,
    marginRight: 2,
    userSelect: 'none',
    pointerEvents: 'none',
  }),
};
