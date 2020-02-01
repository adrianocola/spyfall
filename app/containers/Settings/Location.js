import React, { useState } from 'react';
import { css } from 'emotion';
import { Row, Col, Collapse, Input, Label } from 'reactstrap';
import { MAX_ROLES_ARRAY, SPY_LOCATION } from 'consts';
import { connect } from 'react-redux';
import CogIcon from 'components/CogIcon/CogIcon';
import ReactHtmlParser from 'react-html-parser';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SHADES, COLORS } from 'styles/consts';
import { selectLocationAction, deselectLocationAction, saveCustomLocationAction, remCustomLocationAction } from 'actions/config';
import {logEvent} from 'utils/analytics';

export const Location = React.memo(({locationId, disabled, selected = false, selectLocation, deselectLocation, ...props}) => {
  const [t] = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState(props.location);

  const toggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const updateLocation = (field, value) => {
    setLocation((prevLocation) => ({
      ...prevLocation,
      [field]: value,
    }));
  };

  const onToggleAllSpies = () => {
    if(!location.allSpies){
      updateLocation('name', SPY_LOCATION);
    }
    updateLocation('allSpies', !location.allSpies);
  };

  const onSave = (evt) => {
    logEvent('SETTINGS_SAVE_LOCATION');
    evt.preventDefault();
    props.saveCustomLocation(locationId, location);
    setIsOpen(false);
  };

  const onDelete = (evt) => {
    logEvent('SETTINGS_DELETE_LOCATION');
    evt.preventDefault();
    props.remCustomLocation(locationId);
    setIsOpen(false);
  };

  return (
    <Row className={`${styles.container} justify-content-center`}>
      <Col xs={10}>
        <Row className="justify-content-between">
          <Col xs="auto">
            <Label check className={styles.check}>
              <Input type="checkbox" checked={selected} onChange={selected ? () => deselectLocation(locationId) : () => selectLocation(locationId)} />
              {disabled ? ReactHtmlParser(t(`location.${locationId}`)) : props.location.name}
            </Label>
          </Col>
          <Col xs="auto" onClick={toggle}>
            <CogIcon />
          </Col>
        </Row>
        <Row>
          <Col xs={11}>
            <Collapse isOpen={isOpen}>
              <Row className={`${styles.fields} align-items-center justify-content-center`}>
                <Col xs={4} className="text-right">
                  Location:
                </Col>
                <Col xs={8}>
                  <Input
                    bsSize="sm"
                    className={styles.input}
                    value={disabled ? ReactHtmlParser(t(`location.${locationId}`, ' ')) : location.name}
                    onChange={(evt) => updateLocation('name', evt.target.value)}
                    disabled={disabled || location.allSpies}
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
                      value={disabled ? ReactHtmlParser(t(`location.${locationId}.role${index + 1}`, ' ')) : location[`role${index + 1}`] || ''}
                      onChange={(evt) => updateLocation(`role${index + 1}`, evt.target.value)}
                      disabled={disabled || location.allSpies}
                    />
                  </Col>
                </Row>
              )}
              {!disabled &&
                <>
                  <Row className={`${styles.linksContainer} justify-content-center text-center`}>
                    <Col xs={12}>
                      <Label check className={styles.check}>
                        <Input type="checkbox" checked={location.allSpies} onChange={onToggleAllSpies} />
                        {ReactHtmlParser(t('interface.all_spies'))}
                      </Label>
                    </Col>
                  </Row>
                  <Row className={`${styles.linksContainer} justify-content-center text-center`}>
                    <Col xs={6}>
                      <Link to="#" onClick={onSave}>Save</Link>
                    </Col>
                    <Col xs={6}>
                      <Link className={styles.deleteLocation} to="#" onClick={onDelete}>Delete</Link>
                    </Col>
                  </Row>
                </>
              }
            </Collapse>
          </Col>
        </Row>
      </Col>
    </Row>
  );
});

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
  check: css({
    cursor: 'pointer',
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

const mapStateToProps = (state, ownProps) => ({
  selected: state.config.selectedLocations[ownProps.locationId],
});

const mapDispatchToProps = (dispatch) => ({
  selectLocation: (locationId) => dispatch(selectLocationAction(locationId)),
  deselectLocation: (locationId) => dispatch(deselectLocationAction(locationId)),
  saveCustomLocation: (locationId, location) => dispatch(saveCustomLocationAction(locationId, location)),
  remCustomLocation: (locationId) => dispatch(remCustomLocationAction(locationId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Location);
