import React from 'react';
import { Button } from 'reactstrap';
import { PulseLoader } from 'react-spinners';

const ButtonWithLoading = (props) => (
  <Button {...props} loading={null}>
    {props.loading ? <PulseLoader size={6} color="white" /> : props.children}
  </Button>
);

export default React.memo(ButtonWithLoading);
