const { Server } = require("socket.io");
const io = new Server(8000, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
});

const users = [];

// Listen for 'chat message' event from clients
io.on('connection', (socket) => {
    // Listen for 'new-user-joined' event from a user
    socket.on('new-user-joined', (name) => {
        console.log('new user', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });
    // Listen for 'send' event from a user
    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
});
