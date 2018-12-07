const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
admin.firestore().settings({timestampsInSnapshots: true});

exports.updatePlayer = functions.https.onCall((data, context) =>
  admin.firestore().collection('rooms').doc(data.roomId).get().then((roomQuerySnapshot) => {
    if (!roomQuerySnapshot.exists) {
      return 'invalid_room';
    }

    const roomData = roomQuerySnapshot.data();

    return admin.firestore().collection('rooms').doc(data.roomId).update({
      playersStatus: {
        ...roomData.playersStatus,
        [data.playerName]: {
          ...data.data,
          updatedAt: new Date(),
          userId: context.auth.uid,
        },
      },
    }).then(() => true);
  })
);
