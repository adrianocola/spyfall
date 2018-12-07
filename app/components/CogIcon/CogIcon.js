import React from 'react';
import { css } from 'emotion';
import CogIconImage from 'images/cog.png';

const CogIcon = (props) => (
  <img src={CogIconImage} className={`${styles.cogIcon} ${props.className}`} style={props.style} width={20} alt="Spy icon" />
);

export default CogIcon;

const styles = {
  cogIcon: css({
    marginRight: 5,
    cursor: 'pointer',
  }),
};
