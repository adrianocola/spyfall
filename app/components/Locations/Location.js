import React from 'react';
import { Col, Row } from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';
import { css } from 'emotion';
import cn from 'classnames';

export const Location = ({ locationObj, crossOutLocation, state }) => {
  const className = cn(styles.location, 'border-bottom', {
    [styles.previous]: state?.previous,
    [styles.crossedOut]: state?.crossedOut,
    'font-weight-bold text-danger': state?.highlight,
  });

  return (
    <Row>
      <Col>
        <div className={className} onClick={() => crossOutLocation(locationObj)}>
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
