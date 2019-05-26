import React from 'react';
import { DEFAULT_LOCATIONS } from 'consts';
import Localized from 'components/Localized/Localized';

const LocalizedRole = (props) => {
  const { role, location, customLocations } = props;
  if(DEFAULT_LOCATIONS[location]){
    return <Localized>{`location.${location}.role${role}`}</Localized>;
  }

  return <span>{customLocations[location][`role${role}`]}</span>;
};

export default LocalizedRole;
