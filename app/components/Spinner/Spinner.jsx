import React from 'react';
import { BounceLoader } from 'react-spinners';

const Spinner = (props) => (
  <BounceLoader
    sizeunit="px"
    size={32}
    color="#aaaaaa"
    {...props}
  />
);

export default React.memo(Spinner);
