import React from 'react';
import { observer, inject } from 'mobx-react';
import { css } from 'emotion';
import { Row, Col, Button} from 'reactstrap';
import Localized from 'components/Localized/Localized';
import SelectAll from 'components/SelectAll/SelectAll';

import Location from './Location';

@inject('configStore')
@observer
export default class CustomLocationsList extends React.Component{
  markSelected = (select) => {
    const { configStore } = this.props;
    const { selectedLocations, customLocations } = configStore;
    Object.keys(customLocations).forEach((location) => {
      if(select){
        selectedLocations[location] = true;
      }else{
        delete selectedLocations[location];
      }
    });
  };

  onSelectAll = () => {
    this.markSelected(true);
  };

  onDeselectAll = () => {
    this.markSelected(false);
  };

  render() {
    const { configStore } = this.props;
    const { customLocations } = configStore;
    return (
      <Row className="justify-content-center">
        <Col>
          <Row className={styles.locationsListNameContainer}>
            <Col className="text-center">
              <h5><Localized name="interface.game_locations_custom" /></h5>
            </Col>
          </Row>
          <Row className={styles.checksContainer}>
            <Col xs={6} className="text-center">
              <SelectAll checked onClick={this.onSelectAll} />
            </Col>
            <Col xs={6} className="text-center">
              <SelectAll onClick={this.onDeselectAll} />
            </Col>
          </Row>
          {Object.entries(customLocations).map(([id, location]) =>
            <Location key={id} locationId={id} location={location} />
          )}
          <Row className={styles.addCustomLocation}>
            <Col>
              <Button color="primary" block onClick={() => configStore.addCustomLocation()}><Localized name="interface.add_location" /></Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

const styles = {
  locationsListNameContainer: css({
    marginTop: 20,
  }),
  checksContainer: css({
    marginTop: 20,
    marginBottom: 10,
  }),
  addCustomLocation: css({
    marginTop: 30,
  }),
};
