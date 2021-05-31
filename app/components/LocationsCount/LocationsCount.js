import React from 'react';
import { useSelectedLocationsCount } from 'selectors/selectedLocationsCount';
import { useTotalLocationsCount } from 'selectors/totalLocationsCount';

export const LocationsCount = ({ className, style }) => {
  const selectedLocationsCount = useSelectedLocationsCount();
  const totalLocationsCount = useTotalLocationsCount();
  return (
    <span className={className} style={style}>
      {selectedLocationsCount}/{totalLocationsCount}
    </span>
  );
};

export default React.memo(LocationsCount);
