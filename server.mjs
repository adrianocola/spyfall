/* global process */
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import _ from 'lodash';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 3000;

// In-memory data
const db = {
  roomsData: {},
  roomsLocations: {},
  roomsRemotePlayers: {},
  translations: {}
};

// Load initial translations from public/i18n
const i18nPath = path.join(__dirname, 'public', 'i18n');
if (fs.existsSync(i18nPath)) {
  const files = fs.readdirSync(i18nPath);
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const lang = file.replace('.json', '');
      db.translations[lang] = 100; // Assume 100% translated for local version
    }
  });
}

const normalizePath = (p) => p.startsWith('/') ? p.substring(1) : p;

const broadcast = (path, value) => {
  const normalizedPath = normalizePath(path);

  // Notify exact path
  io.to(normalizedPath).emit('value', { path: normalizedPath, value });

  // Notify parent paths (hierarchical broadcasting)
  const parts = normalizedPath.split('/');
  while (parts.length > 1) {
    parts.pop();
    const parentPath = parts.join('/');
    const parentValue = getFromPath(parentPath, true); // true = silent
    io.to(parentPath).emit('value', { path: parentPath, value: parentValue });
  }

  // Notify child paths if the current value is an object
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    Object.keys(value).forEach(key => {
      const childPath = `${normalizedPath}/${key}`;
      const childValue = value[key];
      io.to(childPath).emit('value', { path: childPath, value: childValue });
    });
  }
};

const getFromPath = (path, silent = false) => {
  const normalizedPath = normalizePath(path);
  const value = _.get(db, normalizedPath.replace(/\//g, '.'));
  if (!silent) console.log(`[GET] ${normalizedPath}`);
  return value;
};

const setToPath = (path, value) => {
  const normalizedPath = normalizePath(path);
  console.log(`[SET] ${normalizedPath}`);
  _.set(db, normalizedPath.replace(/\//g, '.'), value);
  broadcast(normalizedPath, value);
};

const updateToPath = (path, value) => {
  const normalizedPath = normalizePath(path);
  console.log(`[UPDATE] ${normalizedPath}`);
  const current = getFromPath(normalizedPath, true) || {};
  const updated = (typeof current === 'object' && typeof value === 'object') ? { ...current, ...value } : value;
  _.set(db, normalizedPath.replace(/\//g, '.'), updated);
  broadcast(normalizedPath, updated);
};

const removeFromPath = (path) => {
  const normalizedPath = normalizePath(path);
  console.log(`[REMOVE] ${normalizedPath}`);
  const parts = normalizedPath.split('/');
  const last = parts.pop();
  const parentPath = parts.join('.');
  if (parentPath) {
    const parent = _.get(db, parentPath);
    if (parent) delete parent[last];
  } else {
    delete db[last];
  }
  broadcast(normalizedPath, null);
};

io.on('connection', (socket) => {
  console.log(`[CONNECTION] Client connected: ${socket.id}`);
  const onDisconnects = [];

  socket.on('subscribe', (path) => {
    const normalizedPath = normalizePath(path);
    console.log(`[SUBSCRIBE] ${socket.id} to ${normalizedPath}`);
    socket.join(normalizedPath);
    socket.emit('value', { path: normalizedPath, value: getFromPath(normalizedPath) });
  });

  socket.on('unsubscribe', (path) => {
    const normalizedPath = normalizePath(path);
    console.log(`[UNSUBSCRIBE] ${socket.id} from ${normalizedPath}`);
    socket.leave(normalizedPath);
  });

  socket.on('once', (path, callback) => {
    console.log(`[ONCE] ${socket.id} requested ${path}`);
    callback(getFromPath(path));
  });

  socket.on('set', ({ path, value }, callback) => {
    console.log(`[EMIT SET] ${socket.id} to ${path}`);
    setToPath(path, value);
    if (callback) callback();
  });

  socket.on('update', ({ path, value }, callback) => {
    console.log(`[EMIT UPDATE] ${socket.id} to ${path}`);
    updateToPath(path, value);
    if (callback) callback();
  });

  socket.on('remove', (path, callback) => {
    console.log(`[EMIT REMOVE] ${socket.id} from ${path}`);
    removeFromPath(path);
    if (callback) callback();
  });

  socket.on('onDisconnectUpdate', ({ path, value }) => {
    console.log(`[ONDISCONNECT UPDATE] ${socket.id} scheduled for ${path}`);
    onDisconnects.push({ type: 'update', path, value });
  });

  socket.on('onDisconnectCancel', (path) => {
    console.log(`[ONDISCONNECT CANCEL] ${socket.id} for ${path}`);
    _.remove(onDisconnects, (od) => od.path === path);
  });

  socket.on('disconnect', () => {
    console.log(`[DISCONNECT] Client disconnected: ${socket.id}`);
    onDisconnects.forEach((od) => {
      if (od.type === 'update') {
        console.log(`[ONDISCONNECT EXECUTE] ${od.path}`);
        updateToPath(od.path, od.value);
      }
    });
  });
});

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));
// Also serve public directory for i18n
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for client-side routing
app.get(/^(?!\/socket\.io).*$/, (req, res) => {
  const distPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(distPath)) {
    res.sendFile(distPath);
  } else {
    // If dist doesn't exist (e.g. during development), try serving index.html from root
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
