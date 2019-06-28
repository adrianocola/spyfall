import React from 'react';
import { css } from 'emotion';
import { Animated } from 'react-animated-css';

import Spinner from 'components/Spinner/Spinner';

const modalStyle = css({
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100vw',
  padding: 0,
  margin: 0,
  background: 'rgba(0, 0, 0, 0.6)',
});

const SpinnerModal = () => (
  <Animated
    animationIn="fadeIn"
    animationOut="fadeOut"
    className={modalStyle}
    isVisible
  >
    <Spinner color="white" />
  </Animated>
);

export default SpinnerModal;
