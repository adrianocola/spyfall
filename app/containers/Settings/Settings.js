import React, { useCallback, useState } from 'react';
import { css } from 'emotion';
import { Button, Col, Input, Row } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import LocationsCount from 'components/LocationsCount/LocationsCount';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GoX } from 'react-icons/go';
import { useSelectAll } from 'selectors/selectAll';
import { logEvent } from 'utils/analytics';

import DefaultLocationsList from './DefaultLocationsList';
import CustomLocationsList from './CustomLocationsList';
import FilteredLocationsList from './FilteredLocationsList';
import ExportLocations from './ExportLocations';
import DownloadLocations from './DownloadLocations';

export const Settings = () => {
  const [t] = useTranslation();
  const [filter, setFilter] = useState('');
  const { selectAllLocations, deselectAllLocations } = useSelectAll();

  const onFilterChange = useCallback((event) => {
    logEvent('LOCATIONS_FILTER');
    setFilter(event.target.value);
  }, []);

  const onClearFilter = useCallback(() => {
    logEvent('LOCATIONS_FILTER_CLEAR');
    setFilter('');
  }, []);

  return (
    <Row className={`${styles.container} justify-content-center`}>
      <Col xs={12} md={10}>
        <Row className={styles.locationsContainer}>
          <Col className="text-center">
            <h4><Localized name="interface.game_locations" /> (<LocationsCount />)</h4>
          </Col>
        </Row>
        <Row className={`${styles.filterContainer} justify-content-center`}>
          <Col className="text-center">
            <Input placeholder={t('interface.filter')} value={filter} onChange={onFilterChange} />
            {!!filter && <GoX className={`${styles.clearFilter} text-dark`} onClick={onClearFilter} />}
          </Col>
        </Row>
        {!filter && (
          <>
            <DefaultLocationsList version={1} onSelectAll={selectAllLocations} onDeselectAll={deselectAllLocations} />
            <DefaultLocationsList version={2} onSelectAll={selectAllLocations} onDeselectAll={deselectAllLocations} />
            <CustomLocationsList onSelectAll={selectAllLocations} onDeselectAll={deselectAllLocations} />
          </>
        )}
        {!!filter && <FilteredLocationsList filter={filter} />}
        <ExportLocations />
        <DownloadLocations />
        <Row className={`${styles.backContainer} justify-content-center`}>
          <Col xs={12} className="text-center">
            <Link className={styles.backLink} to="/">
              <Button color="danger" block><Localized name="interface.back_to_game" /></Button>
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const styles = {
  container: css({
    marginBottom: 50,
  }),
  locationsContainer: css({
    marginTop: 20,
  }),
  filterContainer: css({
    marginTop: 20,
  }),
  backContainer: css({
    marginTop: 20,
  }),
  backLink: css({
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'none',
    },
  }),
  clearFilter: css({
    position: 'absolute',
    right: 25,
    top: 8,
    fontSize: 22,
    cursor: 'pointer',
  }),
};

export default React.memo(Settings);
