import React from 'react';
import { css } from 'emotion';
import { GoGear } from 'react-icons/go';

const CogIcon = (props) => (
  <GoGear
    className={`${styles.cogIcon} ${props.className}`}
    style={props.style}
    width={20}
    alt="Gear icon"
  />
);

// const CogIcon = (props) => (
//   <img
//     src={CogIconImage}
//     className={`${styles.cogIcon} ${props.className}`}
//     style={props.style}
//     width={20}
//     alt="Spy icon"
//   />
// );

const styles = {
  cogIcon: css({
    marginRight: 5,
    cursor: 'pointer',
  }),
};

export default React.memo(CogIcon);
