const http = require('http');
const { Server } = require('socket.io');

// Create HTTP server
const server = http.createServer();
  const io = new Server(server, {
    cors: {
      // origin:  ['https://ichat-room-user.onrender.com', 'http://127.0.0.1:5500'],
      origin:'*',
      methods: ['GET', 'POST']
    }
  });
  
  
const users = {};

// Listen for 'connection' event from clients
io.on('connection', (socket) => {
  console.log('A user connected.');

  // Listen for 'new-user-joined' event from a user
  socket.on('new-user-joined', (name) => {
    console.log('New user joined:', name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name.toUpperCase());
  });

  // Listen for 'send' event from a user
  // socket.on('send', (message) => {
  //   io.emit('receive', { message: message, name: users[socket.id] });
  // });


  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id].toUpperCase() });
});



  // Listen for 'disconnect' event
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      socket.broadcast.emit('left', users[socket.id]);
      delete users[socket.id];
    }
    console.log('A user disconnected.');
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
