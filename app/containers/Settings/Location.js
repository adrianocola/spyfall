import React from 'react';
import {inject, observer} from 'mobx-react';
import { css } from 'emotion';
import { Row, Col, Collapse, Input } from 'reactstrap';
import { observable } from 'mobx';
import { MAX_ROLES_ARRAY } from 'consts';
import CogIcon from 'components/CogIcon/CogIcon';
import ReactHtmlParser from 'react-html-parser';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SHADES, COLORS } from 'styles/consts';

@inject('configStore')
@observer
export class Location extends React.Component{
  @observable isOpen = false;
  @observable location = {};

  constructor(props) {
    super(props);

    if(!props.disabled){
      const { location } = props;
      this.location = { ...location };
    }
  }

  toggle = () => {
    this.isOpen = !this.isOpen;
  };

  onSave = (evt) => {
    evt.preventDefault();
    const { locationId, configStore } = this.props;
    configStore.saveCustomLocation(locationId, this.location);
    this.isOpen = false;
  };

  onDelete = (evt) => {
    evt.preventDefault();
    const { locationId, configStore } = this.props;
    configStore.removeCustomLocation(locationId);
    this.isOpen = false;
  };

  render() {
    const { t, locationId, location, configStore, disabled } = this.props;
    const { selectedLocations } = configStore;
    const checked = !!selectedLocations[locationId];
    return (
      <Row className={`${styles.container} justify-content-center`}>
        <Col xs={10}>
          <Row className="justify-content-between">
            <Col xs="auto">
              <Input type="checkbox" checked={checked} onChange={checked ? () => configStore.removeFromSelectedLocations(locationId) : () => configStore.addToSelectedLocations(locationId)} />
              {disabled ? ReactHtmlParser(t(`location.${locationId}`)) : location.name}
            </Col>
            <Col xs="auto" onClick={this.toggle}>
              <CogIcon />
            </Col>
          </Row>
          <Row>
            <Col xs={11}>
              <Collapse isOpen={this.isOpen}>
                <Row className={`${styles.fields} align-items-center justify-content-center`}>
                  <Col xs={4} className="text-right">
                    Location:
                  </Col>
                  <Col xs={8}>
                    <Input
                      bsSize="sm"
                      className={styles.input}
                      value={disabled ? ReactHtmlParser(t(`location.${locationId}`, ' ')) : this.location.name}
                      onChange={(evt) => {this.location.name = evt.target.value}}
                      disabled={disabled}
                    />
                  </Col>
                </Row>
                { MAX_ROLES_ARRAY.map((r, index) =>
                  <Row key={index} className={`${styles.fields} align-items-center justify-content-center`}>
                    <Col xs={4} className="text-right">
                      Role {index + 1}:
                    </Col>
                    <Col xs={8}>
                      <Input
                        bsSize="sm"
                        className={styles.input}
                        value={disabled ? ReactHtmlParser(t(`location.${locationId}.role${index + 1}`, ' ')) : this.location[`role${index + 1}`]}
                        onChange={(evt) => {this.location[`role${index + 1}`] = evt.target.value}}
                        disabled={disabled}
                      />
                    </Col>
                  </Row>
                )}
                {!disabled &&
                  <Row className={`${styles.linksContainer} justify-content-center text-center`}>
                    <Col xs={6}>
                      <Link to="#" onClick={this.onSave}>Save</Link>
                    </Col>
                    <Col xs={6}>
                      <Link className={styles.deleteLocation} to="#" onClick={this.onDelete}>Delete</Link>
                    </Col>
                  </Row>
                }
              </Collapse>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

const styles = {
  container: css({
    paddingTop: 10,
    paddingBottom: 10,
    borderBottom: `1px solid ${SHADES.lighter}`,
  }),
  fields: css({
    marginTop: 3,
    fontSize: '0.9rem',
  }),
  input: css({
    height: 25,
  }),
  linksContainer: css({
    marginTop: 20,
  }),
  deleteLocation: css({
    color: COLORS.red,
  }),
};

export default withNamespaces()(Location);
