const users = {};

registerUser = ({id, client, project, room}) => {
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

getUsers = (room) => users[room];

module.exports = { registerUser, getUsers };