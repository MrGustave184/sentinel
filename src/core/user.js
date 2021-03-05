const users = {};

const registerUser = ({id, client, project, room}) => {
    const user = {
        id,
        client,
        project,
        room
    }

    if(! users.hasOwnProperty(room)) {
    	users[room] = [];
    }

    users[room].push(user);

    return user;
}

const getUsers = (room) => users[room];

const broadcastUsers = (room, id) => {

    if(users[room].lenght > 0) {
        return users[room].filter((user) => user.id !== id)
    }

    return room;
}

module.exports = { registerUser, getUsers, broadcastUsers };