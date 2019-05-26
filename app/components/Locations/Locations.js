import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';
import {css} from 'emotion';
import {DARK_COLORS, SHADES} from 'styles/consts';
import { withNamespaces } from 'react-i18next';
import { DEFAULT_LOCATIONS } from 'consts';

export const Locations = (props) => {
  const { t, location, locations = {}, prevLocation } = props;
  return (
    <Container>
      <Row>
        {Object.entries(locations).map(([locationId, locationObj]) =>
          <Col xs={6} key={locationId}>
            <div className={`${styles.location} ${prevLocation === locationId ? styles.prevLocation : ''} ${location === locationId ? styles.highlight : ''}`}>
              {ReactHtmlParser(DEFAULT_LOCATIONS[locationId] ? t(`location.${locationId}`) : locationObj.name)}
            </div>
          </Col>
        )}
      </Row>

    </Container>
  );
};

const styles = {
  location: css({
    borderBottom: `1px solid ${SHADES.lighter}`,
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  }),
  prevLocation: css({
    textDecoration: 'line-through',
  }),
  highlight: css({
    fontWeight: 'bold',
    color: DARK_COLORS.red,
  }),
};

export default withNamespaces()(Locations);
