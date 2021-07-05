const functions = require('firebase-functions');
const Filter = require('bad-words');
const admin = require('firebase-admin');
admin.initializeApp();

const allowedWords = require('./lib/lang.json');
const firestore = admin.firestore();
const MAX_USER_MESSAGES = 14;

exports.detectSpamUsers = functions.firestore
    .document('messages/{msgId}')
    .onCreate(async (doc) => { // .onCreate(async (doc, ctx) => {
      const filter = new Filter();
      filter.removeWords(allowedWords.words);
      const { text, uid } = doc.data();

      if (filter.isProfane(text)) {
        const cleaned = filter.clean(text);
        await doc.ref.update({text: `🤐 I got BANNED for saying... ${cleaned}`});

        await firestore.collection('banned').doc(uid).set({});
      }

      const userStatsRef = firestore.collection('userstats').doc(uid)

      const userData = (await userStatsRef.get()).data();

      if (userData && userData.msgCount >= MAX_USER_MESSAGES) {
          // await firestore.collection('banned').doc(uid).set({});
      } else {
          await userStatsRef.set({ msgCount: (userData.msgCount || 0) + 1 })
      }
});

// Create a new function which is triggered on changes to /status/{uid}
// Note: This is a Realtime Database trigger, *not* Firestore.
exports.onUserChanged = functions.database.ref('/users/{uid}').onUpdate(
  async (change, context) => {
    // Get the data written to Realtime Database
    const event = change.after.val();

    // Then use other event data to create a reference to the
    // corresponding Firestore document.
    const usersFirestoreRef = firestore.doc(`users/${context.params.uid}`);

    // It is likely that the Realtime Database change that triggered
    // this event has already been overwritten by a fast change in
    // online / offline status, so we'll re-read the current data
    // and compare the timestamps.
    const snapshot = await change.after.ref.once('value');
    const user = snapshot.val();
    functions.logger.log(user, event);
    // If the current timestamp for this data is newer than
    // the data that triggered this event, we exit this function.
    if (user.last_changed > event.last_changed) {
      return null;
    }

    // Otherwise, we convert the last_changed field to a Date
    event.last_changed = new Date(event.last_changed);

    const filter = new Filter();

    if (event.textStatus) {
      event.textStatus = filter.clean(event.textStatus);
    }
    if (event.customName) {
      event.customName = filter.clean(event.customName);
    }

    // ... and write it to Firestore.
    return usersFirestoreRef.set(event);
  });
