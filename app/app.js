import 'babel-polyfill';
import 'react-hot-loader';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line import/no-unresolved
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

import EntryPoint from './EntryPoint';

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
}, () => {
  document.body.classList.remove('fontLoaded');
});

import history from './browserHistory';
import { store, persistor } from './store';

ReactDOM.render(
  <EntryPoint store={store} persistor={persistor} history={history} />,
  document.getElementById('app')
);
