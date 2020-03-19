import React from 'react';
import {Col, Row} from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';
import {css} from 'emotion';
import cn from 'classnames';
import {DARK_COLORS, SHADES} from 'styles/consts';

export const Locations = React.memo(({ locationObj, crossOutLocation, state }) => {
  const className = cn(styles.location, {
    [styles.previous]: state?.previous,
    [styles.crossedOut]: state?.crossedOut,
    [styles.highlight]: state?.highlight,
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
});

const styles = {
  location: css({
    borderBottom: `1px solid ${SHADES.lighter}`,
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
  highlight: css({
    fontWeight: 'bold',
    color: DARK_COLORS.red,
  }),
};

export default Locations;
