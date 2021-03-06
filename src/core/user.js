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

const getUsers = (room) => {
    return room ? users[room] : users;
};

const broadcastUsers = (room, id) => {

    if(users[room].lenght > 0) {
        return users[room].filter((user) => user.id !== id)
    }

    return room;
}

const findUser = (id) => {
    for(room in users) {
        const index = users[room].findIndex(user => user.id == id);

        if(index !== -1) {
            // console.log(users[room][index]);
            return users[room][index];
        }
    }

    return false;
};

const removeUser = (id) => {
    for(room in users) {
        const index = users[room].findIndex(user => user.id == id);

        if(index !== -1) {
            let user = users[room][index];
            users[room].splice(index, 1);

            console.log(`user ${user.id} leaves`);

            return user;
        }
    }
}

module.exports = { registerUser, getUsers, broadcastUsers, findUser, removeUser };