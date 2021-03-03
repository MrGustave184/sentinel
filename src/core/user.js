const users = [];

registerUser = (id, clientId, projectId) => {
    const user = {
        id,
        clientId,
        projectId
    }

    users.push(user);

    return user;
}

module.exports = { registerUser };