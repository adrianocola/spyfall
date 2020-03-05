import {isDev} from 'env';
import {analytics} from 'services/firebase';

export const logPageView = (path) => {
  analytics.setCurrentScreen(path);
};

export const logEvent = (action, label) => {
  analytics.logEvent(action, {label});
  if(isDev) console.log(action, label); // eslint-disable-line no-console
};
