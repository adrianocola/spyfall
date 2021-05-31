import _ from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LOCATIONS } from 'consts';

const useSortedLocationsList = (locations) => {
  const [t] = useTranslation();
  const sortedLocations = useMemo(() => {
    const locationsArray = _.map(locations, (locationObj, locationId) => ({
      locationId,
      name: DEFAULT_LOCATIONS[locationId] ? t(`location.${locationId}`) : locationObj.name,
    }));
    return _.orderBy(locationsArray, 'name');
  }, [locations, t]);

  return sortedLocations;
};

export default useSortedLocationsList;
