const _ = require('lodash');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
const promiseLimit = require('promise-limit');
const fetch = require('node-fetch');

const translationsMap = require('./lib/translations.js');
const translationsShortMap = _.reduce(translationsMap, (obj, translation) => {
  obj[translation.short] = translation.id;
  return obj;
}, {});

const CROWDIN_API = functions.config().crowdin.api;

admin.initializeApp();

// once per day
exports.deleteOld = functions.runWith({timeoutSeconds: 120, memory: '512MB'}).pubsub.schedule('0 0 * * *').onRun(async (context) => {
  const limit = promiseLimit(10);
  const timeAgo = moment.utc().subtract(2, 'weeks').valueOf();

  const roomsSnapshot = await admin.database().ref('rooms').orderByChild('updatedAt').endAt(timeAgo).once('value');
  const rooms = roomsSnapshot.val();
  await Promise.all(_.map(rooms, (v, roomId) =>
    limit(() => admin.database().ref(`rooms/${roomId}`).remove())
  ));
  console.log(`DELETED ${_.size(rooms)} OLD ROOMS`); // eslint-disable-line no-console

  const roomsDataSnapshot = await admin.database().ref('roomsData').orderByChild('updatedAt').endAt(timeAgo).once('value');
  const roomsData = roomsDataSnapshot.val();
  await Promise.all(_.map(roomsData, (v, roomId) =>
    limit(() => Promise.all([
      admin.database().ref(`roomsData/${roomId}`).remove(),
      admin.database().ref(`roomsRemotePlayers/${roomId}`).remove(),
      admin.database().ref(`roomsLocations/${roomId}`).remove(),
    ]))
  ));
  console.log(`DELETED ${_.size(roomsData)} NEW ROOMS`); // eslint-disable-line no-console

  const exportsSnapshot = await admin.database().ref('exports').orderByChild('createdAt').endAt(timeAgo).once('value');
  const exports = exportsSnapshot.val();
  await Promise.all(_.map(exports, (v, exportId) =>
    limit(() => admin.database().ref(`exports/${exportId}`).remove())
  ));
  console.log(`DELETED ${_.size(exports)} EXPORTS`); // eslint-disable-line no-console
});

// every 6 hours
exports.updateLocalizationStatus = functions.pubsub.schedule('0 */6 * * *').onRun(async (context) => {
  const status = {};
  const translations = await fetch(`https://api.crowdin.com/api/project/adrianocola-spyfall/status?key=${CROWDIN_API}&json`).then((response) => response.json());
  _.each(translations, (translation) => {
    const code = translationsShortMap[translation.code];
    status[code] = Math.round(100 * translation.approved / translation.phrases);
  });

  return admin.database().ref('translations').set(status);
});
