import 'babel-polyfill';
import 'react-hot-loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

// Import all the third party stuff
import ReactGA from 'react-ga';
import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line import/no-unresolved,import/no-extraneous-dependencies
import FontFaceObserver from 'fontfaceobserver';

// Load the favicon
/* eslint-disable import/no-webpack-loader-syntax */
import '!file-loader?name=[name].[ext]!./favicon.ico';
import '!file-loader?name=[name].[ext]!./favicon-16x16.png';
import '!file-loader?name=[name].[ext]!./favicon-32x32.png';
import '!file-loader?name=[name].[ext]!./favicon-96x96.png';
/* eslint-enable import/no-webpack-loader-syntax */

// Import CSS reset and Global Styles
import 'react-toastify/dist/ReactToastify.css';
import 'styles/theme.scss';

import './services/firebase';

import './i18n';

import env from './env';
import EntryPoint from './EntryPoint';

import history from './browserHistory';
import { store, persistor } from './store';

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});
if (env.GOOGLE_ANALYTICS) {
  ReactGA.initialize(env.GOOGLE_ANALYTICS);
  ReactGA.pageview(window.location.pathname + window.location.search);
}

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
}, () => {
  document.body.classList.remove('fontLoaded');
});

ReactDOM.render(
  <EntryPoint store={store} persistor={persistor} history={history} />,
  document.getElementById('app')
);
