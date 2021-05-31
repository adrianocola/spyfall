import React from 'react';
import { DEFAULT_LOCATIONS } from 'consts';
import Localized from 'components/Localized/Localized';

const LocalizedRole = ({ role, location, customLocations }) => {
  if (DEFAULT_LOCATIONS[location]) {
    return <Localized>{`location.${location}.role${role}`}</Localized>;
  }

  return <span>{customLocations[location][`role${role}`]}</span>;
};

export default React.memo(LocalizedRole);
