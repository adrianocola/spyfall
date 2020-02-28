const _ = require('lodash');

let weight = 1;

const firebase = (name) => ({
  var: `firebase.${name}`,
  url: `https://www.gstatic.com/firebasejs/{{VERSION}}/firebase-${name}.js`,
});

module.exports = _.mapValues({
  'bootstrap/dist/css/bootstrap.min.css': {
    var: null,
    url: 'https://unpkg.com/bootstrap@{{VERSION}}/dist/css/bootstrap.min.css',
  },
  'firebase/app': {
    var: 'firebase',
    url: 'https://www.gstatic.com/firebasejs/{{VERSION}}/firebase-app.js',
  },
  'firebase/auth': firebase('auth'),
  'firebase/analytics': firebase('analytics'),
  'firebase/database': firebase('database'),
  i18next: {
    var: 'i18next',
    url: 'https://unpkg.com/i18next@{{VERSION}}/dist/umd/i18next.min.js',
  },
  lodash: {
    var: '_',
    url: 'https://unpkg.com/lodash@{{VERSION}}/lodash.min.js',
  },
  react: {
    var: 'React',
    url: 'https://unpkg.com/react@{{VERSION}}/umd/react.production.min.js',
  },
  'react-dom': {
    var: 'ReactDOM',
    url: 'https://unpkg.com/react-dom@{{VERSION}}/umd/react-dom.production.min.js',
  },
}, (value) => ({
  ...value,
  weight: weight++, // eslint-disable-line no-plusplus
}));
