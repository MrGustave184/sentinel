const { registerUser, getUsers, broadcastUsers, findUser, removeUser } = require('./core/user');
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
			"https://clients.shocklogic.com",
            "https://dev.shocklogic.com"
		]
	}
};

const io = require("socket.io")(httpServer, options);

io.on("connection", socket => { 
    socket.on('newUser', (user) => {
        const room = `${user.client}_${user.project}`;

        user.room = room.toLowerCase();
        user.id = socket.id;

        socket.join(user.room);

        user = registerUser(user);

        if(user) {
            const users = getUsers(user.room).filter(user => user.id !== socket.id);
            
            socket.emit('welcome', users);

            // Broadcast (everyone but the new client) by room
            socket.broadcast.to(user.room).emit('userArrived', user);
        }
    });

    socket.on('disconnect', () => {
        const user = findUser(socket.id);
        
        if(user) {
            removeUser(user.id);

            socket.broadcast.to(user.room).emit('userLeaves', user);
        }
    });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
	console.log(`server running on port: ${PORT}`);
});