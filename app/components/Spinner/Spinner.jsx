import React from 'react';
import { BounceLoader } from 'react-spinners';

const Spinner = (props) => (
  <BounceLoader
    sizeUnit="px"
    size={32}
    color="#aaaaaa"
    {...props}
  />
);

export default React.memo(Spinner);
