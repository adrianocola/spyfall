import React, { useState } from 'react';
import { css } from 'emotion';
import { Col, Collapse, Input, Label, Row } from 'reactstrap';
import { MAX_ROLES_ARRAY, SPY_LOCATION } from 'consts';
import CogIcon from 'components/CogIcon/CogIcon';
import ReactHtmlParser from 'react-html-parser';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { logEvent } from 'utils/analytics';
import { useSelectedLocation } from 'selectors/selectedLocation';
import { useCustomLocations } from 'selectors/customLocations';

export const Location = React.memo(({ locationId, location, description, disabled }) => {
  const [t] = useTranslation();
  const { selected, selectLocation, deselectLocation } = useSelectedLocation(locationId);
  const { saveCustomLocation, remCustomLocation } = useCustomLocations();
  const [isOpen, setIsOpen] = useState(false);
  const [localLocation, setLocalLocation] = useState(location);

  const toggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const updateLocation = (field, value) => {
    setLocalLocation((prevLocation) => ({
      ...prevLocation,
      [field]: value,
    }));
  };

  const onToggleAllSpies = () => {
    if (!localLocation.allSpies) {
      logEvent('SETTINGS_LOCATION_ALL_SPIES_ON');
      updateLocation('name', SPY_LOCATION);
      updateLocation('prevName', localLocation.name);
    } else {
      logEvent('SETTINGS_LOCATION_ALL_SPIES_OFF');
      updateLocation('name', localLocation.prevName);
    }
    updateLocation('allSpies', !localLocation.allSpies);
  };

  const onSave = (evt) => {
    logEvent('SETTINGS_SAVE_LOCATION');
    evt.preventDefault();
    saveCustomLocation(locationId, localLocation);
    setIsOpen(false);
  };

  const onDelete = (evt) => {
    logEvent('SETTINGS_DELETE_LOCATION');
    evt.preventDefault();
    remCustomLocation(locationId);
    setIsOpen(false);
  };

  return (
    <Row className={`${styles.container} border-bottom justify-content-center`}>
      <Col xs={10}>
        <Row className="justify-content-between">
          <Col xs="auto" className="align-items-center">
            <Label check className={styles.check}>
              <Input type="checkbox" checked={selected} onChange={selected ? () => deselectLocation() : () => selectLocation()} />
              {disabled ? ReactHtmlParser(t(`location.${locationId}`)) : location.name}
            </Label>
            {!!description && <div className={`${styles.description} text-muted`}>{description}</div>}
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
                    value={disabled ? ReactHtmlParser(t(`location.${locationId}`, ' ')) : localLocation.name}
                    onChange={(evt) => updateLocation('name', evt.target.value)}
                    disabled={disabled || localLocation.allSpies}
                  />
                </Col>
              </Row>
              { MAX_ROLES_ARRAY.map((r, index) => (
                <Row key={index} className={`${styles.fields} align-items-center justify-content-center`}>
                  <Col xs={4} className="text-right">
                    Role {index + 1}:
                  </Col>
                  <Col xs={8}>
                    <Input
                      bsSize="sm"
                      className={styles.input}
                      value={disabled ? ReactHtmlParser(t(`location.${locationId}.role${index + 1}`, ' ')) : localLocation[`role${index + 1}`] || ''}
                      onChange={(evt) => updateLocation(`role${index + 1}`, evt.target.value)}
                      disabled={disabled || localLocation.allSpies}
                    />
                  </Col>
                </Row>
              )
              )}
              {!disabled && (
                <>
                  <Row className={`${styles.linksContainer} justify-content-center text-center`}>
                    <Col xs={12}>
                      <Label check className={styles.check}>
                        <Input type="checkbox" checked={localLocation.allSpies ?? false} onChange={onToggleAllSpies} />
                        {ReactHtmlParser(t('interface.all_spies'))}
                      </Label>
                    </Col>
                  </Row>
                  <Row className={`${styles.linksContainer} justify-content-center text-center`}>
                    <Col xs={6}>
                      <Link to="#" onClick={onSave}>Save</Link>
                    </Col>
                    <Col xs={6}>
                      <Link className="text-danger" to="#" onClick={onDelete}>Delete</Link>
                    </Col>
                  </Row>
                </>
              )}
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
  description: css({
    display: 'inline-block',
    marginLeft: 10,
    fontSize: 12,
  }),
};

export default React.memo(Location);
