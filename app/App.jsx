import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

// Import all the third party stuff
import ReactDOM from 'react-dom/client'
import FontFaceObserver from 'fontfaceobserver';

// Import CSS reset and Global Styles
import 'react-toastify/dist/ReactToastify.css';
import '@styles/theme.scss';

import '@services/firebase';

import '@app/i18n';

import EntryPoint from '@app/EntryPoint';

import history from '@app/browserHistory';
import {persistor, store} from '@app/store';

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
}, () => {
  document.body.classList.remove('fontLoaded');
});

ReactDOM.createRoot(document.getElementById('app')).render(
  <EntryPoint store={store} persistor={persistor} history={history} />,
);
