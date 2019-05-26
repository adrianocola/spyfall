import React from 'react';
import { DEFAULT_LOCATIONS } from 'consts';
import Localized from 'components/Localized/Localized';

const LocalizedLocation = (props) => {
  const { location, customLocations } = props;
  if(DEFAULT_LOCATIONS[location]){
    return <Localized>{`location.${location}`}</Localized>;
  }

  return <span>{customLocations[location].name}</span>;
};

export default LocalizedLocation;
