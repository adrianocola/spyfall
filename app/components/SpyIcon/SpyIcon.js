import React from 'react';
import { css } from 'emotion';
import { DARK, LIGHT } from 'consts';
import useDarkMode from 'hooks/useDarkMode';

const SpyIcon = ({ className, style }) => {
  const darkMode = useDarkMode();
  return (
    <div className={`${styles.spyIcon} ${className}`} style={style}>
      <svg
        alt="Spy icon"
        height={24}
        width={24}
        fill={darkMode.value ? LIGHT : DARK}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 100 100"
      >
        <polygon points="92,62.108 92,93.904 7.213,93.904 7.213,62.108 49.606,74.577 " />
        <path d="M88.883,42.159c0,1.035-0.835,1.871-1.87,1.871H12.2c-1.035,0-1.871-0.835-1.871-1.871c0-1.035,0.836-1.871,1.871-1.871  h8.903L30.903,6l18.703,12.469l18.702-7.481l10.985,29.301h7.719C88.048,40.289,88.883,41.125,88.883,42.159z" />
        <path d="M76.414,53.382c0,3.777-3.079,6.857-6.857,6.857c-3.13,0-5.785-2.12-6.596-4.987H55.84c-1.034,0-1.869-0.836-1.869-1.87  c0-1.036,0.835-1.87,1.869-1.87h18.704C75.579,51.512,76.414,52.346,76.414,53.382z" />
        <g>
          <path d="M45.242,53.382c0,3.777-3.08,6.857-6.857,6.857c-3.129,0-5.786-2.12-6.596-4.987h-7.12c-1.035,0-1.871-0.836-1.871-1.87   c0-1.036,0.836-1.87,1.871-1.87h18.703C44.407,51.512,45.242,52.346,45.242,53.382z" />
        </g>
      </svg>
    </div>
  );
};

const styles = {
  spyIcon: css({
    display: 'inline-block',
    marginRight: 5,
  }),
};

export default React.memo(SpyIcon);
