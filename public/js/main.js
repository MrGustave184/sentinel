const emitUser = async () => {

    let jmuser = JSON.parse(localStorage.getItem('userLogged'));

    let response = await fetch("https://dev.shocklogic.com/v2/api/jmuser", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: jmuser.userId,
            client: jmuser.clientId
        })
    });

    response = await response.json();

    let rawUser = response.user[0];

    let firstName = rawUser.First_Name || 'User';
    let familyName = rawUser.Family_Name || '';

    const user = {
        shocklogicId: rawUser.JMUser_Id,
        client: sentinelClient,
        project: sentinelProject,
        name: `${firstName} ${familyName}`,
        email: rawUser.EMail,
        avatar: rawUser.Avatar
    }

    socket.emit('newUser', user);
}

const displayUser = (user) => {
    let divHtml = `${user.client}
    <span class="sentinel-hover">
        <div>${user.shocklogicId}</div>
        <div>${user.name}</div>
        <div>${user.email}</div> 
    </span>`;

    const div = document.createElement("div");
    div.classList.add('sentinel-user', 'm-3', 'p-2');
    div.innerHTML = divHtml;
    div.setAttribute('data-id', user.id)
    document.querySelector(".sentinel-top").appendChild(div);
}

const displayUsers = (users) => {
    users?.forEach(user => displayUser(user));
}

// const socket = io();
const socket = io("https://sentinel.shocklogic.com");

emitUser()

socket.on('message', message => {
    console.log(message);
});

socket.on('welcome', users => displayUsers(users));
socket.on('userArrived', user => displayUser(user));
socket.on('userLeaves', user => {
    let userDiv = document.querySelector("[data-id='"+ user.id +"']");

    if(userDiv) {
        userDiv.remove();
    }
});

const notifyBlur = () => {
    socket.emit('blurEvent', 'user inactive');    
}

// Set the name of the hidden property and the change event for visibility depending on browser
// Uses HTML5 visibility API
let hidden, visibilityChange;

if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

const handleVisibilityChange = () => {
    if (document[hidden]) {
        notifyBlur();
    }
}

// visibility change event
document.addEventListener(visibilityChange, handleVisibilityChange, false);