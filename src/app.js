const { registerUser, getUsers } = require('./core/user');
const path = require('path');

const express = require("express");
const app = express();

// Set static folder
app.use(express.static(path.join(__dirname, '../public')));

const httpServer = require("http").createServer(app);
const options = {
	cors: {
		origin: [
			"http://localhost:3000",
			"https://clients.shocklogic.com"
		]
	}
};

const io = require("socket.io")(httpServer, options);

io.on("connection", socket => { 
    socket.on('newUser', ({ client, project }) => {

        const room = `${client}_${project}`;

        const user = registerUser({
            id: socket.id,
            client,
            project,
            room
        });

        socket.join(room);

        const users = getUsers(room);

        socket.emit('message', users);

        // Broadcast (everyone but the new client) by room
        socket.broadcast.to(room).emit('message', user);
    });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
	console.log(`server running on port: ${PORT}`);
});