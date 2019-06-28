import ReactGA from 'react-ga';
import { isDev } from 'env';

export const logPageView = (path) => {
  ReactGA.pageview(path);
};

export const logEvent = (action, label) => {
  ReactGA.event({
    category: 'EVENTS',
    action,
    label: String(label),
  });
  if(isDev) console.log(action, label); // eslint-disable-line no-console
};
