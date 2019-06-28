import React from 'react';
import { css } from 'emotion';
import SpyIconImage from 'images/spy.png';

const SpyIcon = (props) => (
  <img src={SpyIconImage} className={`${styles.spyIcon} ${props.className}`} style={props.style} width={20} alt="Spy icon" />
);

export default SpyIcon;

const styles = {
  spyIcon: css({
    marginRight: 5,
  }),
};
