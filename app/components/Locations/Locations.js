import React from 'react';
import { observer } from 'mobx-react';
import { Container, Row, Col } from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';
import {css} from 'emotion';
import { SHADES } from 'styles/consts';
import { withNamespaces } from 'react-i18next';
import { DEFAULT_LOCATIONS } from 'consts';

@observer
export class Locations extends React.Component{
  render() {
    const { t, locations = {} } = this.props;
    return (
      <Container>
        <Row>
          {Object.entries(locations).map(([locationId, location]) =>
            <Col xs={6} key={locationId}>
              <div className={styles.location}>
                {ReactHtmlParser(DEFAULT_LOCATIONS[locationId] ? t(`location.${locationId}`) : location.name)}
              </div>
            </Col>
          )}
        </Row>

      </Container>
    );
  }
}

const styles = {
  location: css({
    borderBottom: `1px solid ${SHADES.lighter}`,
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  }),
};

export default withNamespaces()(Locations);
