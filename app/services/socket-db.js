import { io } from 'socket.io-client';
import _ from 'lodash';

class SocketDatabase {
  constructor() {
    this.socket = io(window.location.origin);
    this.listeners = {};

    this.socket.on('value', ({ path, value }) => {
      // Handle potential leading slash inconsistency on client side
      const pathsToNotify = [path, `/${path}`, path.startsWith('/') ? path.substring(1) : `/${path}`];

      pathsToNotify.forEach(p => {
        const callbacks = this.listeners[p];
        if (callbacks) {
          callbacks.forEach((cb) => cb({
            val: () => value,
            exists: () => value !== null && value !== undefined,
            key: p.split('/').pop()
          }));
        }
      });
    });

    // Handle .info/connected
    this.socket.on('connect', () => {
      if (this.listeners['.info/connected']) {
        this.listeners['.info/connected'].forEach((cb) => cb({
          val: () => true,
          exists: () => true,
        }));
      }
    });
    this.socket.on('disconnect', () => {
      if (this.listeners['.info/connected']) {
        this.listeners['.info/connected'].forEach((cb) => cb({
          val: () => false,
          exists: () => true,
        }));
      }
    });
  }

  ref(path) {
    return {
      on: (event, callback) => {
        if (event !== 'value') return;
        if (!this.listeners[path]) {
          this.listeners[path] = [];
        }
        this.listeners[path].push(callback);
        this.socket.emit('subscribe', path);
      },
      off: (event) => {
        if (event && event !== 'value') return;
        delete this.listeners[path];
        this.socket.emit('unsubscribe', path);
      },
      once: (event) => {
        if (event !== 'value') return Promise.resolve();
        return new Promise((resolve) => {
          this.socket.emit('once', path, (value) => {
            resolve({
              val: () => value,
              exists: () => value !== null && value !== undefined,
            });
          });
        });
      },
      set: (value) => {
        return new Promise((resolve) => {
          this.socket.emit('set', { path, value }, resolve);
        });
      },
      update: (value) => {
        return new Promise((resolve) => {
          this.socket.emit('update', { path, value }, resolve);
        });
      },
      remove: () => {
        return new Promise((resolve) => {
          this.socket.emit('remove', path, resolve);
        });
      },
      onDisconnect: () => {
        return {
          update: (value) => {
            this.socket.emit('onDisconnectUpdate', { path, value });
            return Promise.resolve();
          },
          cancel: () => {
            this.socket.emit('onDisconnectCancel', path);
            return Promise.resolve();
          },
        };
      },
    };
  }
}

export const socketDatabase = new SocketDatabase();

export const socketAuth = {
  signInAnonymously: () => {
    // Just mock a user
    let userId = localStorage.getItem('socket_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('socket_user_id', userId);
    }
    return Promise.resolve({
      user: { uid: userId }
    });
  },
  onAuthStateChanged: (cb) => {
    // Not really used in this app based on my scan, but good for completeness
    cb({ uid: localStorage.getItem('socket_user_id') });
  },
  useEmulator: () => {},
};

export const socketAnalytics = {
  logEvent: () => {},
  setCurrentScreen: () => {},
};

export const socketServerTimestamp = Date.now(); // Simple mock, server-side will handle actual time if needed
