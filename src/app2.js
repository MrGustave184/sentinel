const path = require('path');
const cors = require('cors');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { registerUser, getUsers } = require('./core/user');

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = socketio(server);

// // Set static folder
// app.use(express.static(path.join(__dirname, '../public')));

// app.get('/', (req, res) => {
// 	res.send('hello world!');
// 	// res.json({ msg: 'hello world' });
// })

// Run on connection
io.on('connection', socket => {
    socket.on('newUser', ({ client, project }) => {

        let room = `${client}-${project}`;

        const user = registerUser({
            id: socket.id,
            client,
            project
        });

        socket.join(room);

        const users = getUsers();

        socket.emit('message', users);

        // Broadcast (everyone but the new client)
        socket.broadcast.to(room).emit('message', user);
    });

    // To everyone
    // io.emit()
    
    // Broadcast on disconnection
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', 'User leaves');
    });

    // Listen for blur event
    // socket.on('blurEvent', msg => console.log(msg));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server running on port: ${PORT}`));