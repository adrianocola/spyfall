import { isDev } from 'env';
import { analytics } from 'services/firebase';

export const logPageView = (path) => {
  analytics.setCurrentScreen(path);
};

export const logEvent = (action, label) => {
  analytics.logEvent(action, { label });
  if (isDev) console.log(action, label); // eslint-disable-line no-console
};

export const logDataEvent = (action, data) => {
  analytics.logEvent(action, data);
  if (isDev) console.log(action, data); // eslint-disable-line no-console
};
