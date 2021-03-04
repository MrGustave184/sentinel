const { registerUser, getUsers } = require('./core/user');
const app = require("express")();
const cors = require("cors")

app.use(cors())

const httpServer = require("http").createServer(app);
const options = {
	cors: {
		origin: [
			"http://localhost:3000/",
			"http://localhost:3000",
			"https://clients.shocklogic.com/",
			"https://clients.shocklogic.com"
		],
		allowedHeaders: ["access-control-allow-origin"],
		extraHeaders: {
		   	"access-control-allow-origin": "*"
		},
		methods: ["GET", "POST"]
	}
};
const io = require("socket.io")(httpServer, options);


io.on("connection", socket => { 
    socket.on('newUser', ({ client, project }) => {

        let room = `${client}_${project}`;

        const user = registerUser({
            id: socket.id,
            client,
            project,
            room
        });

        // console.log(user);

        socket.join(room);

        // pass room to filter!
        const users = getUsers(room);

        socket.emit('message', users);

        // Broadcast (everyone but the new client)
        socket.broadcast.to(room).emit('message', user);
    });

});

httpServer.listen(3000, () => {
	console.log('Listening');
});