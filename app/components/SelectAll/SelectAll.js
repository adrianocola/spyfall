import React from 'react';
import { css } from 'emotion';
import { Button, Col, Row } from 'reactstrap';

const SelectAll = ({ checked, onClick }) => (
  <Row className="justify-content-center align-items-center">
    <Col xs="auto">
      <Button outline color="primary" size="sm" onClick={onClick}>
        <input type="checkbox" checked={checked} readOnly className={styles.checkbox} />
        <input type="checkbox" checked={checked} readOnly className={styles.checkbox} />
        <input type="checkbox" checked={checked} readOnly className={styles.checkbox} />
      </Button>

    </Col>
  </Row>
);

const styles = {
  checkbox: css({
    marginLeft: 2,
    marginRight: 2,
    userSelect: 'none',
    pointerEvents: 'none',
  }),
};

export default React.memo(SelectAll);
