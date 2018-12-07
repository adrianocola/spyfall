import React from 'react';
import { observer, inject } from 'mobx-react';
import { css } from 'emotion';
import { Row, Col} from 'reactstrap';
import SelectAll from 'components/SelectAll/SelectAll';

import { DEFAULT_LOCATIONS } from 'consts';

import Location from './Location';

@inject('configStore')
@observer
export default class DefaultLocationsList extends React.Component{
  constructor(props) {
    super(props);

    this.locations = Object.entries(DEFAULT_LOCATIONS).filter(([key, value]) => value === props.version).map(([key]) => key);
  }

  markSelected = (select) => {
    const { configStore: { selectedLocations } } = this.props;
    this.locations.forEach((location) => {
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
    const { version } = this.props;
    return (
      <Row className="justify-content-center">
        <Col>
          <Row className={styles.locationsListNameContainer}>
            <Col className="text-center">
              <h5>Spyfall{version === 1 ? '' : ` ${version}`}</h5>
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
          {this.locations.map((location) =>
            <Location key={location} locationId={location} disabled />
          )}
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
};
