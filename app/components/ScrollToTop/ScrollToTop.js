import { useRef, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

export const ScrollToTop = ({ location, children }) => {
  const prevLocationRef = useRef(null);
  const prevLocation = prevLocationRef.current;
  useEffect(() => {
    if (prevLocation && location !== prevLocation) {
      window.scrollTo(0, 0);
    }
    prevLocationRef.current = location;
  });

  return children;
};

export default withRouter(ScrollToTop);
