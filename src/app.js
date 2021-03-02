const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, '../public')));

// Run on connection
io.on('connection', socket => {
    console.log('new socket connection');

    // Emit message on new conenction
    socket.emit('message', 'Success');

    // Broadcast (everyone but the new client)
    socket.broadcast.emit('message', 'New user arrives!');

    // To everyone
    // io.emit()
    
    // Broadcast on disconnection
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', 'User leaves');
    })
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server running on port: ${PORT}`));