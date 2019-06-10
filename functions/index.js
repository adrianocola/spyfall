const _ = require('lodash');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
const promiseLimit = require('promise-limit');

admin.initializeApp();

// once per day
exports.deleteOld = functions.pubsub.schedule('0 0 * * *').onRun(async (context) => {
  const limit = promiseLimit(10);
  const oneWeekAgo = moment.utc().subtract(1, 'week').valueOf();

  const roomsSnapshot = await admin.database().ref('rooms').orderByChild('updatedAt').endAt(oneWeekAgo).once('value');
  const rooms = roomsSnapshot.val();
  await Promise.all(_.map(rooms, (v, roomId) =>
    limit(() => admin.database().ref(`rooms/${roomId}`).remove())
  ));

  const exportsSnapshot = await admin.database().ref('exports').orderByChild('createdAt').endAt(oneWeekAgo).once('value');
  const exports = exportsSnapshot.val();
  await Promise.all(_.map(exports, (v, exportId) =>
    limit(() => admin.database().ref(`exports/${exportId}`).remove())
  ));
});
