/* eslint-disable no-console */
const _ = require('lodash');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
const promiseLimit = require('promise-limit');
const axios = require('axios').default;

const CROWDIN_ACCESS_TOKEN = functions.config().crowdin.accesstoken;

admin.initializeApp();

const getCrowdinTranslations = () =>
  axios.get('https://api.crowdin.com/api/v2/projects/285998/languages/progress?limit=500', {
    headers: {
      Authorization: `Bearer ${CROWDIN_ACCESS_TOKEN}`,
    },
  }).then((response) => response.data.data);

const updateTranslations = async () => {
  const translations = await getCrowdinTranslations();

  const status = {};
  _.each(translations, (translationData) => {
    const translation = translationData.data;
    status[translation.language.locale] = translation.translationProgress;
  });

  await admin.database().ref('translations').set(status);

  return status;
};

// every hour
exports.deleteOld = functions.runWith({ timeoutSeconds: 120, memory: '256MB' }).pubsub.schedule('0 * * * *').onRun(async () => {
  const limit = promiseLimit(10);
  const timeAgo = moment.utc().subtract(2, 'weeks').valueOf();

  const roomsSnapshot = await admin.database().ref('rooms').orderByChild('updatedAt').endAt(timeAgo).once('value');
  const rooms = roomsSnapshot.val();
  await Promise.all(_.map(rooms, (v, roomId) =>
    limit(() => admin.database().ref(`rooms/${roomId}`).remove())
  ));
  console.log(`DELETED ${_.size(rooms)} OLD ROOMS`);

  const roomsDataSnapshot = await admin.database().ref('roomsData').orderByChild('updatedAt').endAt(timeAgo).once('value');
  const roomsData = roomsDataSnapshot.val();
  await Promise.all(_.map(roomsData, (v, roomId) =>
    limit(() => Promise.all([
      admin.database().ref(`roomsData/${roomId}`).remove(),
      admin.database().ref(`roomsRemotePlayers/${roomId}`).remove(),
      admin.database().ref(`roomsLocations/${roomId}`).remove(),
    ]))
  ));
  console.log(`DELETED ${_.size(roomsData)} NEW ROOMS`);

  const exportsSnapshot = await admin.database().ref('exports').orderByChild('createdAt').endAt(timeAgo).once('value');
  const exports = exportsSnapshot.val();
  await Promise.all(_.map(exports, (v, exportId) =>
    limit(() => admin.database().ref(`exports/${exportId}`).remove())
  ));
  console.log(`DELETED ${_.size(exports)} EXPORTS`);
});

// every 6 hours
exports.updateLocalizationStatus = functions.pubsub.schedule('0 */6 * * *').onRun(() => updateTranslations());

exports.getCrowdinTranslations = functions.https.onRequest(async (req, res) => {
  const translations = await getCrowdinTranslations();

  res.json(translations);
});

exports.forceUpdateLocalizationStatus = functions.https.onRequest(async (req, res) => {
  const translations = await updateTranslations();

  res.json(translations);
});
