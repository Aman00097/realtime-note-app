const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const noteRoutes = require('./routes/noteRoutes');
const Note = require('./models/note');
const connectDB = require('./config/db');
const { Server } = require('socket.io');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use('/notes', noteRoutes);

const activeUsers = {}; // { noteId: Set(socketIds) }

app.get('/live-collaborators', (req, res) => {
  const counts = {};
  for (const [noteId, socketSet] of Object.entries(activeUsers)) {
    counts[noteId] = socketSet.size;
  }
  res.json(counts);
});

io.on('connection', (socket) => {
  console.log('🟢 Connected:', socket.id);

  socket.on('join-note', (noteId) => {
    socket.join(noteId);

    if (!activeUsers[noteId]) activeUsers[noteId] = new Set();
    activeUsers[noteId].add(socket.id);

    // Send count to the joining socket
    socket.emit('collaborators-count', {
      noteId,
      count: activeUsers[noteId].size
    });

    // Broadcast count to others
    socket.to(noteId).emit('collaborators-count', {
      noteId,
      count: activeUsers[noteId].size
    });
  });

  socket.on('send-changes', ({ noteId, content }) => {
    socket.broadcast.to(noteId).emit('receive-changes', content);
  });

  socket.on('save-note', async ({ noteId, content }) => {
    await Note.findByIdAndUpdate(noteId, {
      content,
      updatedAt: new Date()
    });
  });

  socket.on('disconnecting', () => {
    const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
    for (const noteId of rooms) {
      if (activeUsers[noteId]) {
        activeUsers[noteId].delete(socket.id);

        io.to(noteId).emit('collaborators-count', {
          noteId,
          count: activeUsers[noteId].size
        });

        if (activeUsers[noteId].size === 0) {
          delete activeUsers[noteId];
        }
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
