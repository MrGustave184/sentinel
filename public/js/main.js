const socket = new io();

socket.on('message', message => {
    console.log(message);
});