import { useEffect } from 'react';
import { database, databaseServerTimestamp } from 'services/firebase';

export const isOfflineForDatabase = {
  online: false,
  lastOnline: databaseServerTimestamp,
};

export const isOnlineForDatabase = {
  online: true,
  lastOnline: databaseServerTimestamp,
};

export const usePresence = (path, check) => {
  useEffect(() => {
    if (check) {
      const presenceRef = database.ref('.info/connected');
      const pathRef = database.ref(path);
      let onDisconnect;
      presenceRef.on('value', (snapshot) => {
        if (!snapshot || snapshot.val() === false) {
          return pathRef.update(isOfflineForDatabase).catch((err) => console.log('not snapshot error', err)); // eslint-disable-line no-console
        }

        onDisconnect = pathRef.onDisconnect();
        onDisconnect.update(isOfflineForDatabase).then(() => {
          pathRef.update(isOnlineForDatabase);
        }).catch((err) => console.log('onDisconnect error', err)); // eslint-disable-line no-console
      });
      return () => {
        if (onDisconnect) {
          onDisconnect.cancel();
        }
        presenceRef.off();
        pathRef.off();
      };
    }
  }, [check, path]);
};

export default usePresence;
