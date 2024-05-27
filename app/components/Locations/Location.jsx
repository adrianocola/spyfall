import React from 'react';
import { Col, Row } from 'reactstrap';
import ReactHtmlParser from 'html-react-parser';
import { css } from 'emotion';

export const Location = ({ locationObj, crossOutLocation, state }) => {
  const classes = [styles.location, 'border-bottom'];
  if (state?.previous) classes.push(styles.previous);
  if (state?.crossedOut) classes.push(styles.crossedOut);
  if (state?.highlight) classes.push('font-weight-bold', 'text-danger');

  return (
    <Row>
      <Col>
        <div className={classes.join(' ')} onClick={() => crossOutLocation(locationObj)}>
          {ReactHtmlParser(locationObj.name)}
        </div>
      </Col>
    </Row>
  );
};

const styles = {
  location: css({
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    cursor: 'pointer',
    userSelect: 'none',
  }),
  previous: css({
    textDecoration: 'line-through',
    cursor: 'not-allowed',
    fontWeight: 'bold',
  }),
  crossedOut: css({
    textDecoration: 'line-through',
  }),
};

export default React.memo(Location);
